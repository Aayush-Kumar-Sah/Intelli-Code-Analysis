/**
 * Core code analyzer module
 * Provides general code quality metrics and analysis
 */

export interface CodeAnalysis {
  filename: string;
  language: string;
  metrics: {
    linesOfCode: number;
    commentLines: number;
    blankLines: number;
    codeToCommentRatio: number;
  };
  functions: FunctionInfo[];
  variables: VariableInfo[];
  issues: Issue[];
  quality: {
    score: number;
    grade: string;
    factors: QualityFactor[];
  };
}

export interface FunctionInfo {
  name: string;
  lineNumber: number;
  parameters: number;
  linesOfCode: number;
  complexity: number;
}

export interface VariableInfo {
  name: string;
  lineNumber: number;
  type: string;
  scope: string;
}

export interface Issue {
  severity: "error" | "warning" | "info";
  message: string;
  line?: number;
  column?: number;
}

export interface QualityFactor {
  name: string;
  score: number;
  description: string;
}

/**
 * Analyzes code and returns comprehensive metrics
 */
export function analyzeCode(
  code: string,
  language: string,
  filename: string
): CodeAnalysis {
  const lines = code.split("\n");
  const metrics = calculateMetrics(code, language);
  const functions = extractFunctions(code, language);
  const variables = extractVariables(code, language);
  const issues = detectIssues(code, language);
  const quality = calculateQuality(metrics, functions, issues);

  return {
    filename,
    language,
    metrics,
    functions,
    variables,
    issues,
    quality,
  };
}

function calculateMetrics(code: string, language: string) {
  const lines = code.split("\n");
  let commentLines = 0;
  let blankLines = 0;

  const commentPatterns: Record<string, RegExp[]> = {
    javascript: [/^\s*\/\//, /^\s*\/\*/, /^\s*\*/],
    typescript: [/^\s*\/\//, /^\s*\/\*/, /^\s*\*/],
    python: [/^\s*#/, /^\s*"""/, /^\s*'''/],
    java: [/^\s*\/\//, /^\s*\/\*/, /^\s*\*/],
  };

  const patterns = commentPatterns[language] || commentPatterns.javascript;

  for (const line of lines) {
    if (line.trim() === "") {
      blankLines++;
    } else if (patterns.some((pattern) => pattern.test(line))) {
      commentLines++;
    }
  }

  const linesOfCode = lines.length - blankLines;
  const codeToCommentRatio = commentLines > 0 ? linesOfCode / commentLines : linesOfCode;

  return {
    linesOfCode,
    commentLines,
    blankLines,
    codeToCommentRatio,
  };
}

function extractFunctions(code: string, language: string): FunctionInfo[] {
  const functions: FunctionInfo[] = [];
  const lines = code.split("\n");

  // Simple pattern matching for different languages
  const functionPatterns: Record<string, RegExp> = {
    javascript: /function\s+(\w+)\s*\(([^)]*)\)/,
    typescript: /(?:function|const|let|var)\s+(\w+)\s*[=:]\s*\(([^)]*)\)|function\s+(\w+)\s*\(([^)]*)\)/,
    python: /def\s+(\w+)\s*\(([^)]*)\)/,
    java: /(?:public|private|protected|static|\s)+\w+\s+(\w+)\s*\(([^)]*)\)/,
  };

  const pattern = functionPatterns[language] || functionPatterns.javascript;

  lines.forEach((line, index) => {
    const match = line.match(pattern);
    if (match) {
      const name = match[1] || match[3] || "anonymous";
      const params = (match[2] || match[4] || "").split(",").filter((p) => p.trim());

      functions.push({
        name,
        lineNumber: index + 1,
        parameters: params.length,
        linesOfCode: estimateFunctionLines(lines, index),
        complexity: estimateComplexity(lines, index),
      });
    }
  });

  return functions;
}

function estimateFunctionLines(lines: string[], startIndex: number): number {
  let braceCount = 0;
  let started = false;
  let count = 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("{")) {
      braceCount++;
      started = true;
    }
    if (started) count++;
    if (line.includes("}")) {
      braceCount--;
      if (braceCount === 0 && started) break;
    }
  }

  return count;
}

function estimateComplexity(lines: string[], startIndex: number): number {
  let complexity = 1;
  const functionLines = lines.slice(
    startIndex,
    startIndex + estimateFunctionLines(lines, startIndex)
  );

  for (const line of functionLines) {
    // Count decision points
    if (
      /\bif\b|\belse\b|\bfor\b|\bwhile\b|\bcase\b|\bcatch\b|\b\?\b|\b&&\b|\b\|\|\b/.test(
        line
      )
    ) {
      complexity++;
    }
  }

  return complexity;
}

function extractVariables(code: string, language: string): VariableInfo[] {
  const variables: VariableInfo[] = [];
  const lines = code.split("\n");

  const varPatterns: Record<string, RegExp> = {
    javascript: /(?:var|let|const)\s+(\w+)/g,
    typescript: /(?:var|let|const)\s+(\w+)/g,
    python: /(\w+)\s*=/g,
    java: /(?:int|String|double|float|boolean|char|long)\s+(\w+)/g,
  };

  const pattern = varPatterns[language] || varPatterns.javascript;

  lines.forEach((line, index) => {
    const matches = line.matchAll(pattern);
    for (const match of matches) {
      variables.push({
        name: match[1],
        lineNumber: index + 1,
        type: "inferred",
        scope: "local",
      });
    }
  });

  return variables;
}

function detectIssues(code: string, language: string): Issue[] {
  const issues: Issue[] = [];
  const lines = code.split("\n");

  lines.forEach((line, index) => {
    // Long lines
    if (line.length > 120) {
      issues.push({
        severity: "info",
        message: "Line exceeds 120 characters",
        line: index + 1,
      });
    }

    // console.log statements (for JavaScript/TypeScript)
    if ((language === "javascript" || language === "typescript") && /console\.log/.test(line)) {
      issues.push({
        severity: "warning",
        message: "console.log statement found - consider using a proper logger",
        line: index + 1,
      });
    }

    // TODO comments
    if (/TODO|FIXME|HACK/.test(line)) {
      issues.push({
        severity: "info",
        message: "TODO/FIXME comment found",
        line: index + 1,
      });
    }

    // Multiple statements on one line
    if (/;.*;/.test(line) && !line.trim().startsWith("//")) {
      issues.push({
        severity: "warning",
        message: "Multiple statements on one line",
        line: index + 1,
      });
    }
  });

  return issues;
}

function calculateQuality(
  metrics: any,
  functions: FunctionInfo[],
  issues: Issue[]
): { score: number; grade: string; factors: QualityFactor[] } {
  const factors: QualityFactor[] = [];
  let totalScore = 0;

  // Comment ratio factor
  const commentScore =
    metrics.codeToCommentRatio > 10
      ? 5
      : metrics.codeToCommentRatio > 5
      ? 7
      : 10;
  factors.push({
    name: "Documentation",
    score: commentScore,
    description: `Code to comment ratio: ${metrics.codeToCommentRatio.toFixed(2)}`,
  });
  totalScore += commentScore;

  // Function complexity factor
  const avgComplexity =
    functions.length > 0
      ? functions.reduce((sum, f) => sum + f.complexity, 0) / functions.length
      : 1;
  const complexityScore = avgComplexity > 10 ? 3 : avgComplexity > 5 ? 7 : 10;
  factors.push({
    name: "Complexity",
    score: complexityScore,
    description: `Average cyclomatic complexity: ${avgComplexity.toFixed(1)}`,
  });
  totalScore += complexityScore;

  // Issues factor
  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const issueScore =
    errorCount > 0 ? 2 : warningCount > 5 ? 5 : warningCount > 0 ? 8 : 10;
  factors.push({
    name: "Code Quality",
    score: issueScore,
    description: `${errorCount} errors, ${warningCount} warnings`,
  });
  totalScore += issueScore;

  // Function size factor
  const avgFunctionSize =
    functions.length > 0
      ? functions.reduce((sum, f) => sum + f.linesOfCode, 0) / functions.length
      : 0;
  const sizeScore = avgFunctionSize > 50 ? 5 : avgFunctionSize > 20 ? 8 : 10;
  factors.push({
    name: "Function Size",
    score: sizeScore,
    description: `Average function size: ${avgFunctionSize.toFixed(0)} lines`,
  });
  totalScore += sizeScore;

  const finalScore = (totalScore / 40) * 100;
  const grade =
    finalScore >= 90
      ? "A"
      : finalScore >= 80
      ? "B"
      : finalScore >= 70
      ? "C"
      : finalScore >= 60
      ? "D"
      : "F";

  return {
    score: Math.round(finalScore),
    grade,
    factors,
  };
}
