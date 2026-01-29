/**
 * Code smell detection module
 * Identifies common code smells and anti-patterns
 */

export interface CodeSmell {
  type: string;
  severity: "high" | "medium" | "low";
  description: string;
  location?: {
    line: number;
    column?: number;
  };
  suggestion: string;
}

export interface CodeSmellReport {
  totalSmells: number;
  smellsByType: Record<string, number>;
  smells: CodeSmell[];
  summary: string;
}

/**
 * Detects code smells in the provided code
 */
export function detectCodeSmells(
  code: string,
  language: string
): CodeSmellReport {
  const smells: CodeSmell[] = [];

  // Detect various code smells
  smells.push(...detectLongMethods(code));
  smells.push(...detectLongParameterList(code, language));
  smells.push(...detectDuplicateCode(code));
  smells.push(...detectDeadCode(code, language));
  smells.push(...detectMagicNumbers(code));
  smells.push(...detectNestedLoops(code));
  smells.push(...detectGodClass(code, language));
  smells.push(...detectLargeClass(code, language));
  smells.push(...detectPrimitiveObsession(code, language));
  smells.push(...detectLongSwitch(code));

  const smellsByType: Record<string, number> = {};
  smells.forEach((smell) => {
    smellsByType[smell.type] = (smellsByType[smell.type] || 0) + 1;
  });

  const summary = generateSummary(smells);

  return {
    totalSmells: smells.length,
    smellsByType,
    smells,
    summary,
  };
}

function detectLongMethods(code: string): CodeSmell[] {
  const smells: CodeSmell[] = [];
  const lines = code.split("\n");
  let inFunction = false;
  let functionStart = 0;
  let braceCount = 0;

  lines.forEach((line, index) => {
    if (/function\s+\w+|=>\s*{|def\s+\w+/.test(line)) {
      inFunction = true;
      functionStart = index;
      braceCount = 0;
    }

    if (inFunction) {
      if (line.includes("{")) braceCount++;
      if (line.includes("}")) {
        braceCount--;
        if (braceCount === 0) {
          const functionLength = index - functionStart + 1;
          if (functionLength > 50) {
            smells.push({
              type: "Long Method",
              severity: "high",
              description: `Method is ${functionLength} lines long (recommended max: 50)`,
              location: { line: functionStart + 1 },
              suggestion:
                "Break this method into smaller, more focused methods",
            });
          }
          inFunction = false;
        }
      }
    }
  });

  return smells;
}

function detectLongParameterList(code: string, language: string): CodeSmell[] {
  const smells: CodeSmell[] = [];
  const lines = code.split("\n");

  lines.forEach((line, index) => {
    const match = line.match(/function\s+\w+\s*\(([^)]+)\)|def\s+\w+\s*\(([^)]+)\)/);
    if (match) {
      const params = (match[1] || match[2] || "").split(",").filter((p) => p.trim());
      if (params.length > 5) {
        smells.push({
          type: "Long Parameter List",
          severity: "medium",
          description: `Function has ${params.length} parameters (recommended max: 5)`,
          location: { line: index + 1 },
          suggestion:
            "Consider using a parameter object or breaking the function into smaller parts",
        });
      }
    }
  });

  return smells;
}

function detectDuplicateCode(code: string): CodeSmell[] {
  const smells: CodeSmell[] = [];
  const lines = code.split("\n");
  const lineGroups: Map<string, number[]> = new Map();

  // Group identical non-empty lines
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed && trimmed.length > 20) {
      if (!lineGroups.has(trimmed)) {
        lineGroups.set(trimmed, []);
      }
      lineGroups.get(trimmed)!.push(index + 1);
    }
  });

  // Find duplicates
  lineGroups.forEach((lineNumbers, line) => {
    if (lineNumbers.length >= 3) {
      smells.push({
        type: "Duplicate Code",
        severity: "medium",
        description: `Identical line found ${lineNumbers.length} times`,
        location: { line: lineNumbers[0] },
        suggestion: "Extract duplicate code into a reusable function or constant",
      });
    }
  });

  return smells;
}

function detectDeadCode(code: string, language: string): CodeSmell[] {
  const smells: CodeSmell[] = [];
  const lines = code.split("\n");

  lines.forEach((line, index) => {
    // Unreachable code after return
    if (/return\s+.*;/.test(line) && index + 1 < lines.length) {
      const nextLine = lines[index + 1].trim();
      if (nextLine && nextLine !== "}" && !nextLine.startsWith("//")) {
        smells.push({
          type: "Dead Code",
          severity: "high",
          description: "Unreachable code after return statement",
          location: { line: index + 2 },
          suggestion: "Remove unreachable code",
        });
      }
    }

    // Commented out code
    if (/^\s*\/\/.*[{};()].*$/.test(line)) {
      smells.push({
        type: "Commented Code",
        severity: "low",
        description: "Commented out code detected",
        location: { line: index + 1 },
        suggestion: "Remove commented code or restore it",
      });
    }
  });

  return smells;
}

function detectMagicNumbers(code: string): CodeSmell[] {
  const smells: CodeSmell[] = [];
  const lines = code.split("\n");

  lines.forEach((line, index) => {
    // Find numeric literals (excluding 0, 1, -1)
    const numbers = line.match(/\b\d{2,}\b/g);
    if (numbers && numbers.length > 0) {
      numbers.forEach((num) => {
        if (num !== "0" && num !== "1" && parseInt(num) > 1) {
          smells.push({
            type: "Magic Number",
            severity: "low",
            description: `Magic number '${num}' used without explanation`,
            location: { line: index + 1 },
            suggestion: "Replace with a named constant",
          });
        }
      });
    }
  });

  return smells.slice(0, 10); // Limit to avoid too many results
}

function detectNestedLoops(code: string): CodeSmell[] {
  const smells: CodeSmell[] = [];
  const lines = code.split("\n");
  let loopDepth = 0;
  const loopStack: number[] = [];

  lines.forEach((line, index) => {
    if (/\b(for|while|forEach)\b/.test(line)) {
      loopDepth++;
      loopStack.push(index + 1);

      if (loopDepth >= 3) {
        smells.push({
          type: "Deeply Nested Loops",
          severity: "high",
          description: `Loop nested ${loopDepth} levels deep`,
          location: { line: index + 1 },
          suggestion:
            "Consider extracting inner loops into separate methods or using different algorithms",
        });
      }
    }

    if (line.includes("}") && loopStack.length > 0) {
      loopStack.pop();
      loopDepth = Math.max(0, loopDepth - 1);
    }
  });

  return smells;
}

function detectGodClass(code: string, language: string): CodeSmell[] {
  const smells: CodeSmell[] = [];

  // Count methods/functions
  const methodCount = (code.match(/function\s+\w+|def\s+\w+|public\s+\w+\s+\w+\s*\(/g) || [])
    .length;

  if (methodCount > 20) {
    smells.push({
      type: "God Class",
      severity: "high",
      description: `Class/module has ${methodCount} methods (recommended max: 20)`,
      suggestion:
        "Split this class into multiple smaller, focused classes following Single Responsibility Principle",
    });
  }

  return smells;
}

function detectLargeClass(code: string, language: string): CodeSmell[] {
  const smells: CodeSmell[] = [];
  const lines = code.split("\n").length;

  if (lines > 500) {
    smells.push({
      type: "Large Class",
      severity: "medium",
      description: `Class/module is ${lines} lines long (recommended max: 500)`,
      suggestion: "Break down into smaller, more focused modules",
    });
  }

  return smells;
}

function detectPrimitiveObsession(code: string, language: string): CodeSmell[] {
  const smells: CodeSmell[] = [];
  const lines = code.split("\n");

  lines.forEach((line, index) => {
    // Detect multiple primitive parameters
    const match = line.match(/\(([^)]+)\)/);
    if (match) {
      const params = match[1].split(",");
      const primitiveCount = params.filter((p) =>
        /string|number|int|float|boolean|bool/.test(p.toLowerCase())
      ).length;

      if (primitiveCount > 3) {
        smells.push({
          type: "Primitive Obsession",
          severity: "medium",
          description: `${primitiveCount} primitive parameters detected`,
          location: { line: index + 1 },
          suggestion: "Consider creating a parameter object or class",
        });
      }
    }
  });

  return smells;
}

function detectLongSwitch(code: string): CodeSmell[] {
  const smells: CodeSmell[] = [];
  const lines = code.split("\n");
  let inSwitch = false;
  let switchStart = 0;
  let caseCount = 0;

  lines.forEach((line, index) => {
    if (/switch\s*\(/.test(line)) {
      inSwitch = true;
      switchStart = index;
      caseCount = 0;
    }

    if (inSwitch && /case\s+/.test(line)) {
      caseCount++;
    }

    if (inSwitch && line.trim() === "}") {
      if (caseCount > 7) {
        smells.push({
          type: "Long Switch Statement",
          severity: "medium",
          description: `Switch has ${caseCount} cases (recommended max: 7)`,
          location: { line: switchStart + 1 },
          suggestion: "Consider using polymorphism or a strategy pattern",
        });
      }
      inSwitch = false;
    }
  });

  return smells;
}

function generateSummary(smells: CodeSmell[]): string {
  if (smells.length === 0) {
    return "No code smells detected. Code looks clean!";
  }

  const highSeverity = smells.filter((s) => s.severity === "high").length;
  const mediumSeverity = smells.filter((s) => s.severity === "medium").length;
  const lowSeverity = smells.filter((s) => s.severity === "low").length;

  return `Found ${smells.length} code smell(s): ${highSeverity} high severity, ${mediumSeverity} medium severity, ${lowSeverity} low severity. Consider addressing high severity issues first.`;
}
