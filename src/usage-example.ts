#!/usr/bin/env node

/**
 * Example Usage Script
 * Demonstrates how to use the Intelli Code Analysis MCP Server programmatically
 */

import { analyzeCode } from "./analyzer.js";
import { detectCodeSmells } from "./code-smells.js";
import { suggestRefactorings } from "./refactorings.js";
import { analyzeComplexity } from "./complexity.js";
import { generateAIPrompt } from "./ai-integration.js";

// Example 1: Analyze a simple function
console.log("=== Example 1: Basic Code Analysis ===\n");
const simpleCode = `
function calculateTotal(items) {
  let total = 0;
  for (let item of items) {
    total += item.price;
  }
  return total;
}
`;

const analysis = analyzeCode(simpleCode, "javascript", "example.js");
console.log("Quality Score:", analysis.quality.score);
console.log("Grade:", analysis.quality.grade);
console.log("Functions Found:", analysis.functions.length);
console.log("Issues:", analysis.issues.length);
console.log();

// Example 2: Detect Code Smells
console.log("=== Example 2: Code Smell Detection ===\n");
const codeWithSmells = `
function process(a, b, c, d, e, f, g) {
  const temp = a + b;
  console.log(temp);
  if (temp > 100) {
    for (let i = 0; i < temp; i++) {
      for (let j = 0; j < temp; j++) {
        console.log(i * j);
      }
    }
  }
  return temp * 99;
}
`;

const smells = detectCodeSmells(codeWithSmells, "javascript");
console.log("Total Code Smells:", smells.totalSmells);
console.log("Smells by Type:", smells.smellsByType);
console.log("Summary:", smells.summary);
console.log();

// Example 3: Get Refactoring Suggestions
console.log("=== Example 3: Refactoring Suggestions ===\n");
const refactorings = suggestRefactorings(codeWithSmells, "javascript");
console.log("Total Suggestions:", refactorings.totalSuggestions);
console.log("By Priority:", refactorings.suggestionsByPriority);
console.log("Top Suggestion:", refactorings.refactorings[0]?.title || "None");
console.log();

// Example 4: Complexity Analysis
console.log("=== Example 4: Complexity Analysis ===\n");
const complexCode = `
function complexLogic(x, y, z) {
  if (x > 0) {
    if (y > 0) {
      while (z > 0) {
        if (x && y || z) {
          for (let i = 0; i < 10; i++) {
            z--;
          }
        }
      }
    }
  }
  return x + y + z;
}
`;

const complexity = analyzeComplexity(complexCode, "javascript");
console.log("Cyclomatic Complexity:", complexity.cyclomaticComplexity);
console.log("Cognitive Complexity:", complexity.cognitiveComplexity);
console.log("Nesting Depth:", complexity.nestingDepth);
console.log("Maintainability Index:", complexity.maintainabilityIndex);
console.log("Summary:", complexity.summary);
console.log();

// Example 5: Generate AI Prompt for Security Analysis
console.log("=== Example 5: AI Prompt Generation ===\n");
const securityCode = `
function getUserData(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  return database.execute(query);
}
`;

const prompt = generateAIPrompt(securityCode, "javascript", "security");
console.log("Generated Prompt Length:", prompt.length, "characters");
console.log("Prompt Preview (first 200 chars):");
console.log(prompt.substring(0, 200) + "...");
console.log();

// Example 6: Multi-file Analysis
console.log("=== Example 6: Multi-file Analysis ===\n");
const files = [
  {
    filename: "utils.js",
    code: "export function add(a, b) { return a + b; }",
    language: "javascript",
  },
  {
    filename: "main.js",
    code: "import { add } from './utils.js'; console.log(add(5, 10));",
    language: "javascript",
  },
];

files.forEach((file) => {
  const fileAnalysis = analyzeCode(file.code, file.language, file.filename);
  console.log(`${file.filename}: Quality Score = ${fileAnalysis.quality.score}`);
});

console.log("\n=== All Examples Completed ===");
