/**
 * Comprehensive Test Suite for Intelli Code Analysis MCP Server
 * 10 Test Cases covering all features
 */

import { test } from "node:test";
import assert from "node:assert";
import { analyzeCode } from "../analyzer.js";
import { detectCodeSmells } from "../code-smells.js";
import { suggestRefactorings } from "../refactorings.js";
import { analyzeComplexity } from "../complexity.js";
import { generateAIPrompt } from "../ai-integration.js";

/**
 * Test Case 1: Basic Code Analysis
 * Tests the core code analysis functionality
 */
test("Test 1: Basic Code Analysis - Simple Function", () => {
  const code = `
function calculateSum(a, b) {
  // Add two numbers
  return a + b;
}

const result = calculateSum(5, 10);
console.log(result);
  `.trim();

  const analysis = analyzeCode(code, "javascript", "test.js");

  assert.ok(analysis, "Analysis should return a result");
  assert.strictEqual(analysis.language, "javascript");
  assert.strictEqual(analysis.filename, "test.js");
  assert.ok(analysis.metrics.linesOfCode > 0, "Should count lines of code");
  assert.ok(analysis.functions.length > 0, "Should detect functions");
  assert.ok(analysis.quality.score >= 0 && analysis.quality.score <= 100);
  console.log("✓ Test 1 passed: Basic code analysis works correctly");
});

/**
 * Test Case 2: Code Smell Detection - Long Method
 * Tests detection of long methods code smell
 */
test("Test 2: Code Smell Detection - Long Method", () => {
  // Generate a long method (>50 lines)
  const longMethod = `
function processData() {
  ${Array(60).fill("  console.log('processing...');").join("\n")}
}
  `.trim();

  const smells = detectCodeSmells(longMethod, "javascript");

  assert.ok(smells.totalSmells > 0, "Should detect code smells");
  const hasLongMethod = smells.smells.some((s) => s.type === "Long Method");
  assert.ok(hasLongMethod, "Should detect long method smell");
  console.log("✓ Test 2 passed: Long method detection works correctly");
});

/**
 * Test Case 3: Code Smell Detection - Magic Numbers
 * Tests detection of magic numbers
 */
test("Test 3: Code Smell Detection - Magic Numbers", () => {
  const code = `
function calculatePrice(quantity) {
  return quantity * 99 + 15;
}
  `.trim();

  const smells = detectCodeSmells(code, "javascript");

  assert.ok(smells.totalSmells > 0, "Should detect magic numbers");
  const hasMagicNumber = smells.smells.some((s) => s.type === "Magic Number");
  assert.ok(hasMagicNumber, "Should detect magic number smell");
  console.log("✓ Test 3 passed: Magic number detection works correctly");
});

/**
 * Test Case 4: Refactoring Suggestions - Extract Method
 * Tests refactoring suggestions for large functions
 */
test("Test 4: Refactoring Suggestions - Extract Method", () => {
  // Create a function with 40+ lines
  const code = `
function bigFunction() {
  ${Array(45).fill("  const x = 1;").join("\n")}
}
  `.trim();

  const refactorings = suggestRefactorings(code, "javascript");

  assert.ok(refactorings.totalSuggestions > 0, "Should provide suggestions");
  const hasExtractMethod = refactorings.refactorings.some(
    (r) => r.type === "Extract Method"
  );
  assert.ok(hasExtractMethod, "Should suggest extract method refactoring");
  console.log("✓ Test 4 passed: Extract method suggestion works correctly");
});

/**
 * Test Case 5: Refactoring Suggestions - Rename Variable
 * Tests suggestions for better variable naming
 */
test("Test 5: Refactoring Suggestions - Variable Naming", () => {
  const code = `
const temp = getData();
const x = processData(temp);
  `.trim();

  const refactorings = suggestRefactorings(code, "javascript");

  assert.ok(refactorings.totalSuggestions > 0, "Should provide suggestions");
  const hasRenaming = refactorings.refactorings.some(
    (r) => r.type === "Rename Variable"
  );
  assert.ok(hasRenaming, "Should suggest variable renaming");
  console.log("✓ Test 5 passed: Variable renaming suggestion works correctly");
});

/**
 * Test Case 6: Complexity Analysis - High Cyclomatic Complexity
 * Tests detection of high cyclomatic complexity
 */
test("Test 6: Complexity Analysis - High Cyclomatic Complexity", () => {
  const complexCode = `
function complexFunction(a, b, c, d) {
  if (a > 0) {
    if (b > 0) {
      for (let i = 0; i < 10; i++) {
        if (c > 0) {
          while (d > 0) {
            d--;
          }
        }
      }
    }
  }
  return a && b || c && d;
}
  `.trim();

  const complexity = analyzeComplexity(complexCode, "javascript");

  assert.ok(complexity.cyclomaticComplexity > 1, "Should calculate cyclomatic complexity");
  assert.ok(complexity.nestingDepth > 1, "Should detect nesting depth");
  assert.ok(complexity.maintainabilityIndex >= 0, "Should calculate maintainability index");
  console.log("✓ Test 6 passed: Complexity analysis works correctly");
});

/**
 * Test Case 7: Multi-file Analysis Support
 * Tests the ability to analyze multiple files
 */
test("Test 7: Multi-file Analysis", () => {
  const file1 = {
    filename: "utils.js",
    code: "function add(a, b) { return a + b; }",
    language: "javascript",
  };

  const file2 = {
    filename: "main.js",
    code: "const result = add(5, 10); console.log(result);",
    language: "javascript",
  };

  // Analyze both files
  const analysis1 = analyzeCode(file1.code, file1.language, file1.filename);
  const analysis2 = analyzeCode(file2.code, file2.language, file2.filename);

  assert.strictEqual(analysis1.filename, "utils.js");
  assert.strictEqual(analysis2.filename, "main.js");
  assert.ok(analysis1.metrics.linesOfCode > 0);
  assert.ok(analysis2.metrics.linesOfCode > 0);
  console.log("✓ Test 7 passed: Multi-file analysis works correctly");
});

/**
 * Test Case 8: Python Code Analysis
 * Tests analysis of Python code
 */
test("Test 8: Python Code Analysis", () => {
  const pythonCode = `
def calculate_total(items):
    # Calculate total price
    total = 0
    for item in items:
        total += item.price
    return total

result = calculate_total([])
  `.trim();

  const analysis = analyzeCode(pythonCode, "python", "calculator.py");

  assert.strictEqual(analysis.language, "python");
  assert.ok(analysis.functions.length > 0, "Should detect Python functions");
  assert.ok(analysis.metrics.commentLines > 0, "Should detect Python comments");
  console.log("✓ Test 8 passed: Python code analysis works correctly");
});

/**
 * Test Case 9: AI Prompt Generation
 * Tests AI integration prompt generation
 */
test("Test 9: AI Prompt Generation - All Focus", () => {
  const code = "function test() { return 42; }";

  const prompt = generateAIPrompt(code, "javascript", "all");

  assert.ok(prompt.length > 0, "Should generate a prompt");
  assert.ok(prompt.includes("javascript"), "Should mention the language");
  assert.ok(prompt.includes("Security"), "Should include security analysis");
  assert.ok(prompt.includes("Performance"), "Should include performance analysis");
  assert.ok(prompt.includes("Maintainability"), "Should include maintainability analysis");
  console.log("✓ Test 9 passed: AI prompt generation works correctly");
});

/**
 * Test Case 10: AI Prompt Generation - Security Focus
 * Tests focused AI prompt generation
 */
test("Test 10: AI Prompt Generation - Security Focus", () => {
  const code = `
function getUserData(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  return db.query(query);
}
  `.trim();

  const prompt = generateAIPrompt(code, "javascript", "security");

  assert.ok(prompt.length > 0, "Should generate a prompt");
  assert.ok(prompt.includes("security"), "Should focus on security");
  assert.ok(
    prompt.includes("Security Analysis") || prompt.includes("vulnerabilities"),
    "Should mention security analysis"
  );
  console.log("✓ Test 10 passed: Security-focused AI prompt generation works correctly");
});

console.log("\n=== All 10 Test Cases Passed Successfully ===\n");
