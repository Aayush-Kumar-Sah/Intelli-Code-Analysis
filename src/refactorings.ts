/**
 * Refactoring suggestions module
 * Provides intelligent refactoring recommendations
 */

export interface Refactoring {
  type: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  before?: string;
  after?: string;
  location?: {
    line: number;
  };
  effort: string;
  benefits: string[];
}

export interface RefactoringReport {
  totalSuggestions: number;
  suggestionsByPriority: {
    high: number;
    medium: number;
    low: number;
  };
  refactorings: Refactoring[];
  summary: string;
}

/**
 * Suggests refactoring opportunities
 */
export function suggestRefactorings(
  code: string,
  language: string
): RefactoringReport {
  const refactorings: Refactoring[] = [];

  refactorings.push(...suggestExtractMethod(code));
  refactorings.push(...suggestRenameVariable(code, language));
  refactorings.push(...suggestIntroduceParameter(code));
  refactorings.push(...suggestReplaceConditional(code));
  refactorings.push(...suggestSimplifyExpression(code));
  refactorings.push(...suggestEncapsulateField(code, language));
  refactorings.push(...suggestRemoveDuplication(code));
  refactorings.push(...suggestModernSyntax(code, language));

  const suggestionsByPriority = {
    high: refactorings.filter((r) => r.priority === "high").length,
    medium: refactorings.filter((r) => r.priority === "medium").length,
    low: refactorings.filter((r) => r.priority === "low").length,
  };

  const summary = generateSummary(refactorings);

  return {
    totalSuggestions: refactorings.length,
    suggestionsByPriority,
    refactorings,
    summary,
  };
}

function suggestExtractMethod(code: string): Refactoring[] {
  const refactorings: Refactoring[] = [];
  const lines = code.split("\n");
  let inFunction = false;
  let functionStart = 0;
  let braceCount = 0;
  let functionLines = 0;

  lines.forEach((line, index) => {
    if (/function\s+\w+|=>\s*{|def\s+\w+/.test(line)) {
      inFunction = true;
      functionStart = index;
      braceCount = 0;
      functionLines = 0;
    }

    if (inFunction) {
      functionLines++;
      if (line.includes("{")) braceCount++;
      if (line.includes("}")) {
        braceCount--;
        if (braceCount === 0) {
          if (functionLines > 30) {
            refactorings.push({
              type: "Extract Method",
              priority: "high",
              title: "Extract method from long function",
              description: `Function is ${functionLines} lines. Consider extracting logical blocks into separate methods.`,
              location: { line: functionStart + 1 },
              effort: "Medium",
              benefits: [
                "Improved readability",
                "Better testability",
                "Enhanced reusability",
              ],
            });
          }
          inFunction = false;
        }
      }
    }
  });

  return refactorings;
}

function suggestRenameVariable(code: string, language: string): Refactoring[] {
  const refactorings: Refactoring[] = [];
  const lines = code.split("\n");

  lines.forEach((line, index) => {
    // Single letter variables (except common ones like i, j, k in loops)
    const vars = line.match(/\b[a-z]\b/g);
    if (vars && !/(for|while)\s*\(/.test(line)) {
      vars.forEach((v) => {
        if (v !== "i" && v !== "j" && v !== "k") {
          refactorings.push({
            type: "Rename Variable",
            priority: "low",
            title: `Rename variable '${v}' to something more descriptive`,
            description: "Single letter variable names reduce code readability",
            location: { line: index + 1 },
            effort: "Low",
            benefits: ["Improved code clarity", "Better maintainability"],
          });
        }
      });
    }

    // Variables with unclear names
    if (/\b(temp|tmp|data|val|obj)\b/.test(line) && /(?:let|const|var)/.test(line)) {
      refactorings.push({
        type: "Rename Variable",
        priority: "medium",
        title: "Use more descriptive variable names",
        description: "Generic names like 'temp', 'data', 'val' don't convey purpose",
        location: { line: index + 1 },
        effort: "Low",
        benefits: ["Better code documentation", "Easier understanding"],
      });
    }
  });

  return refactorings.slice(0, 5); // Limit results
}

function suggestIntroduceParameter(code: string): Refactoring[] {
  const refactorings: Refactoring[] = [];
  const lines = code.split("\n");

  lines.forEach((line, index) => {
    // Magic numbers in function calls
    if (/\w+\s*\(\s*\d+/.test(line) && !/for\s*\(/.test(line)) {
      refactorings.push({
        type: "Introduce Parameter",
        priority: "low",
        title: "Extract hardcoded value to parameter",
        description: "Hardcoded values reduce flexibility",
        location: { line: index + 1 },
        effort: "Low",
        benefits: ["Increased flexibility", "Better reusability"],
      });
    }
  });

  return refactorings.slice(0, 3);
}

function suggestReplaceConditional(code: string): Refactoring[] {
  const refactorings: Refactoring[] = [];
  const lines = code.split("\n");

  lines.forEach((line, index) => {
    // Nested ternary operators
    if ((line.match(/\?/g) || []).length > 1) {
      refactorings.push({
        type: "Replace Conditional",
        priority: "high",
        title: "Replace nested ternary with if-else",
        description: "Nested ternary operators are hard to read and maintain",
        location: { line: index + 1 },
        before: "const x = a ? b ? c : d : e;",
        after: "let x;\nif (a) {\n  x = b ? c : d;\n} else {\n  x = e;\n}",
        effort: "Low",
        benefits: ["Better readability", "Easier debugging"],
      });
    }

    // Multiple conditions with &&/||
    if ((line.match(/&&|\|\|/g) || []).length > 3) {
      refactorings.push({
        type: "Replace Conditional",
        priority: "medium",
        title: "Simplify complex conditional",
        description: "Complex conditions should be broken down or extracted",
        location: { line: index + 1 },
        effort: "Medium",
        benefits: ["Improved clarity", "Better testability"],
      });
    }
  });

  return refactorings;
}

function suggestSimplifyExpression(code: string): Refactoring[] {
  const refactorings: Refactoring[] = [];
  const lines = code.split("\n");

  lines.forEach((line, index) => {
    // Redundant comparisons
    if (/===\s*true|===\s*false/.test(line)) {
      refactorings.push({
        type: "Simplify Expression",
        priority: "low",
        title: "Remove redundant boolean comparison",
        description: "Comparing to true/false is unnecessary",
        location: { line: index + 1 },
        before: "if (condition === true)",
        after: "if (condition)",
        effort: "Low",
        benefits: ["Cleaner code", "Less verbose"],
      });
    }

    // Double negation
    if (/!!/.test(line)) {
      refactorings.push({
        type: "Simplify Expression",
        priority: "low",
        title: "Avoid double negation",
        description: "Use Boolean() instead of !! for clarity",
        location: { line: index + 1 },
        before: "const bool = !!value;",
        after: "const bool = Boolean(value);",
        effort: "Low",
        benefits: ["Better readability"],
      });
    }
  });

  return refactorings;
}

function suggestEncapsulateField(code: string, language: string): Refactoring[] {
  const refactorings: Refactoring[] = [];
  const lines = code.split("\n");

  if (language === "javascript" || language === "typescript") {
    lines.forEach((line, index) => {
      // Public class fields
      if (/^\s*this\.\w+\s*=/.test(line) && !/constructor/.test(code.substring(0, code.indexOf(line)))) {
        refactorings.push({
          type: "Encapsulate Field",
          priority: "medium",
          title: "Encapsulate public field with getter/setter",
          description: "Direct field access should be controlled through methods",
          location: { line: index + 1 },
          effort: "Medium",
          benefits: [
            "Better encapsulation",
            "Controlled access",
            "Easier to add validation",
          ],
        });
      }
    });
  }

  return refactorings.slice(0, 3);
}

function suggestRemoveDuplication(code: string): Refactoring[] {
  const refactorings: Refactoring[] = [];
  const lines = code.split("\n");
  const seenLines = new Map<string, number[]>();

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed && trimmed.length > 15) {
      if (!seenLines.has(trimmed)) {
        seenLines.set(trimmed, []);
      }
      seenLines.get(trimmed)!.push(index + 1);
    }
  });

  seenLines.forEach((lineNumbers, line) => {
    if (lineNumbers.length >= 2) {
      refactorings.push({
        type: "Remove Duplication",
        priority: "medium",
        title: "Extract duplicated code",
        description: `Similar code appears ${lineNumbers.length} times`,
        location: { line: lineNumbers[0] },
        effort: "Medium",
        benefits: ["DRY principle", "Easier maintenance", "Single source of truth"],
      });
    }
  });

  return refactorings.slice(0, 5);
}

function suggestModernSyntax(code: string, language: string): Refactoring[] {
  const refactorings: Refactoring[] = [];
  const lines = code.split("\n");

  if (language === "javascript" || language === "typescript") {
    lines.forEach((line, index) => {
      // var instead of let/const
      if (/\bvar\b/.test(line)) {
        refactorings.push({
          type: "Modern Syntax",
          priority: "low",
          title: "Replace var with let or const",
          description: "Use modern variable declarations",
          location: { line: index + 1 },
          before: "var x = 10;",
          after: "const x = 10; // or let if reassigned",
          effort: "Low",
          benefits: ["Better scoping", "Prevents accidental reassignment"],
        });
      }

      // Function instead of arrow function (in some contexts)
      if (/function\s*\(/.test(line) && /\.map|\.filter|\.forEach/.test(line)) {
        refactorings.push({
          type: "Modern Syntax",
          priority: "low",
          title: "Use arrow function",
          description: "Arrow functions are more concise for callbacks",
          location: { line: index + 1 },
          before: "array.map(function(x) { return x * 2; })",
          after: "array.map(x => x * 2)",
          effort: "Low",
          benefits: ["Concise syntax", "Lexical this binding"],
        });
      }
    });
  }

  return refactorings.slice(0, 5);
}

function generateSummary(refactorings: Refactoring[]): string {
  if (refactorings.length === 0) {
    return "No refactoring suggestions. Code structure looks good!";
  }

  const high = refactorings.filter((r) => r.priority === "high").length;
  const medium = refactorings.filter((r) => r.priority === "medium").length;
  const low = refactorings.filter((r) => r.priority === "low").length;

  return `Found ${refactorings.length} refactoring opportunity(ies): ${high} high priority, ${medium} medium priority, ${low} low priority. Focus on high priority items for maximum impact.`;
}
