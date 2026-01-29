/**
 * Code complexity analysis module
 * Calculates various complexity metrics
 */

export interface ComplexityMetrics {
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  nestingDepth: number;
  halsteadMetrics: HalsteadMetrics;
  maintainabilityIndex: number;
  summary: string;
  recommendations: string[];
}

export interface HalsteadMetrics {
  vocabulary: number;
  length: number;
  difficulty: number;
  effort: number;
  time: number;
  bugs: number;
}

/**
 * Analyzes code complexity
 */
export function analyzeComplexity(
  code: string,
  language: string
): ComplexityMetrics {
  const cyclomaticComplexity = calculateCyclomaticComplexity(code);
  const cognitiveComplexity = calculateCognitiveComplexity(code);
  const nestingDepth = calculateNestingDepth(code);
  const halsteadMetrics = calculateHalsteadMetrics(code, language);
  const maintainabilityIndex = calculateMaintainabilityIndex(
    code,
    cyclomaticComplexity,
    halsteadMetrics
  );

  const recommendations = generateRecommendations(
    cyclomaticComplexity,
    cognitiveComplexity,
    nestingDepth,
    maintainabilityIndex
  );

  const summary = generateComplexitySummary(
    cyclomaticComplexity,
    cognitiveComplexity,
    maintainabilityIndex
  );

  return {
    cyclomaticComplexity,
    cognitiveComplexity,
    nestingDepth,
    halsteadMetrics,
    maintainabilityIndex,
    summary,
    recommendations,
  };
}

/**
 * Calculate Cyclomatic Complexity (McCabe)
 * Measures the number of linearly independent paths through code
 */
function calculateCyclomaticComplexity(code: string): number {
  let complexity = 1; // Base complexity

  // Decision points that increase complexity
  const decisionPatterns = [
    /\bif\b/g,
    /\belse\s+if\b/g,
    /\bwhile\b/g,
    /\bfor\b/g,
    /\bcase\b/g,
    /\bcatch\b/g,
    /&&/g,
    /\|\|/g,
    /\?/g,
  ];

  decisionPatterns.forEach((pattern) => {
    const matches = code.match(pattern);
    if (matches) {
      complexity += matches.length;
    }
  });

  return complexity;
}

/**
 * Calculate Cognitive Complexity
 * Measures how difficult code is to understand
 */
function calculateCognitiveComplexity(code: string): number {
  let complexity = 0;
  const lines = code.split("\n");
  let nestingLevel = 0;

  lines.forEach((line) => {
    // Increment nesting for blocks
    if (/{/.test(line) && /(if|for|while|function|else)/.test(line)) {
      nestingLevel++;
    }

    // Add complexity for control structures with nesting bonus
    if (/\b(if|for|while|catch)\b/.test(line)) {
      complexity += 1 + nestingLevel;
    }

    // Add complexity for logical operators
    const logicalOps = (line.match(/&&|\|\|/g) || []).length;
    complexity += logicalOps;

    // Decrement nesting
    if (/}/.test(line)) {
      nestingLevel = Math.max(0, nestingLevel - 1);
    }
  });

  return complexity;
}

/**
 * Calculate maximum nesting depth
 */
function calculateNestingDepth(code: string): number {
  let maxDepth = 0;
  let currentDepth = 0;

  for (const char of code) {
    if (char === "{") {
      currentDepth++;
      maxDepth = Math.max(maxDepth, currentDepth);
    } else if (char === "}") {
      currentDepth = Math.max(0, currentDepth - 1);
    }
  }

  return maxDepth;
}

/**
 * Calculate Halstead Complexity Metrics
 */
function calculateHalsteadMetrics(
  code: string,
  language: string
): HalsteadMetrics {
  // Simplified Halstead metrics calculation
  // In production, this would use proper AST parsing

  const operators = extractOperators(code, language);
  const operands = extractOperands(code, language);

  const n1 = new Set(operators).size; // Unique operators
  const n2 = new Set(operands).size; // Unique operands
  const N1 = operators.length; // Total operators
  const N2 = operands.length; // Total operands

  const vocabulary = n1 + n2;
  const length = N1 + N2;
  const calculatedLength = n1 * Math.log2(n1 || 1) + n2 * Math.log2(n2 || 1);
  const volume = length * Math.log2(vocabulary || 1);
  const difficulty = (n1 / 2) * (N2 / (n2 || 1));
  const effort = difficulty * volume;
  const time = effort / 18; // seconds
  const bugs = Math.pow(effort, 2 / 3) / 3000;

  return {
    vocabulary,
    length,
    difficulty: Math.round(difficulty * 100) / 100,
    effort: Math.round(effort),
    time: Math.round(time * 100) / 100,
    bugs: Math.round(bugs * 1000) / 1000,
  };
}

function extractOperators(code: string, language: string): string[] {
  const operators: string[] = [];

  // Common operators
  const operatorPatterns = [
    /\+/g,
    /-/g,
    /\*/g,
    /\//g,
    /%/g,
    /=/g,
    /==/g,
    /===/g,
    /!=/g,
    /!==/g,
    /</g,
    />/g,
    /<=/g,
    />=/g,
    /&&/g,
    /\|\|/g,
    /!/g,
    /\?/g,
    /:/g,
  ];

  operatorPatterns.forEach((pattern) => {
    const matches = code.match(pattern);
    if (matches) {
      operators.push(...matches);
    }
  });

  // Keywords as operators
  const keywords = code.match(
    /\b(if|else|for|while|return|function|class|const|let|var|new|this|try|catch)\b/g
  );
  if (keywords) {
    operators.push(...keywords);
  }

  return operators;
}

function extractOperands(code: string, language: string): string[] {
  const operands: string[] = [];

  // Variables and identifiers
  const identifiers = code.match(/\b[a-zA-Z_]\w*\b/g);
  if (identifiers) {
    operands.push(...identifiers);
  }

  // Literals
  const numbers = code.match(/\b\d+\.?\d*\b/g);
  if (numbers) {
    operands.push(...numbers);
  }

  const strings = code.match(/"[^"]*"|'[^']*'|`[^`]*`/g);
  if (strings) {
    operands.push(...strings);
  }

  return operands;
}

/**
 * Calculate Maintainability Index
 * Range: 0-100 (higher is better)
 */
function calculateMaintainabilityIndex(
  code: string,
  cyclomaticComplexity: number,
  halsteadMetrics: HalsteadMetrics
): number {
  const lines = code.split("\n");
  const loc = lines.filter((line) => line.trim()).length;

  // Maintainability Index formula
  const volume = Math.log(halsteadMetrics.vocabulary || 1) * halsteadMetrics.length;
  const MI =
    171 -
    5.2 * Math.log(volume || 1) -
    0.23 * cyclomaticComplexity -
    16.2 * Math.log(loc || 1);

  // Normalize to 0-100 scale
  const normalized = Math.max(0, Math.min(100, MI));

  return Math.round(normalized);
}

function generateRecommendations(
  cyclomaticComplexity: number,
  cognitiveComplexity: number,
  nestingDepth: number,
  maintainabilityIndex: number
): string[] {
  const recommendations: string[] = [];

  if (cyclomaticComplexity > 10) {
    recommendations.push(
      "Cyclomatic complexity is high (>10). Consider breaking down complex functions into smaller ones."
    );
  }

  if (cognitiveComplexity > 15) {
    recommendations.push(
      "Cognitive complexity is high (>15). Simplify control flow and reduce nesting."
    );
  }

  if (nestingDepth > 4) {
    recommendations.push(
      "Deep nesting detected (>4 levels). Extract nested logic into separate functions."
    );
  }

  if (maintainabilityIndex < 65) {
    recommendations.push(
      "Maintainability index is low (<65). Focus on reducing complexity and improving code structure."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Code complexity is within acceptable ranges. Good job!"
    );
  }

  return recommendations;
}

function generateComplexitySummary(
  cyclomaticComplexity: number,
  cognitiveComplexity: number,
  maintainabilityIndex: number
): string {
  const complexity =
    cyclomaticComplexity > 20
      ? "very high"
      : cyclomaticComplexity > 10
      ? "high"
      : cyclomaticComplexity > 5
      ? "moderate"
      : "low";

  const maintainability =
    maintainabilityIndex > 85
      ? "excellent"
      : maintainabilityIndex > 65
      ? "good"
      : maintainabilityIndex > 40
      ? "fair"
      : "poor";

  return `Cyclomatic complexity is ${complexity} (${cyclomaticComplexity}), cognitive complexity is ${cognitiveComplexity}, and maintainability is ${maintainability} (${maintainabilityIndex}/100).`;
}
