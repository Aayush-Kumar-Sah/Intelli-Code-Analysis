/**
 * AI Integration module
 * Generates prompts for external AI services (GPT/Claude)
 */

export interface AIPromptOptions {
  focus: string;
  includeMetrics: boolean;
  includeExamples: boolean;
}

/**
 * Generates a comprehensive prompt for AI analysis
 */
export function generateAIPrompt(
  code: string,
  language: string,
  focus: string = "all"
): string {
  const focusAreas = getFocusAreas(focus);

  let prompt = `# Code Analysis Request

Please analyze the following ${language} code and provide detailed insights.

## Code to Analyze:
\`\`\`${language}
${code}
\`\`\`

## Analysis Focus Areas:
${focusAreas.map((area) => `- ${area}`).join("\n")}

## Required Analysis:

### 1. Code Quality Assessment
- Evaluate overall code quality and structure
- Identify strengths and weaknesses
- Rate the code on a scale of 1-10

### 2. Security Analysis
${focus === "security" || focus === "all" ? `- Identify potential security vulnerabilities
- Check for common security anti-patterns (SQL injection, XSS, etc.)
- Evaluate input validation and sanitization
- Assess authentication and authorization practices
- Check for sensitive data exposure` : "- Basic security check only"}

### 3. Performance Optimization
${focus === "performance" || focus === "all" ? `- Identify performance bottlenecks
- Suggest optimization opportunities
- Evaluate algorithmic complexity
- Check for unnecessary computations or redundant operations
- Analyze memory usage patterns` : "- Basic performance check only"}

### 4. Maintainability
${focus === "maintainability" || focus === "all" ? `- Assess code readability and clarity
- Evaluate naming conventions
- Check documentation and comments
- Identify technical debt
- Suggest refactoring opportunities` : "- Basic maintainability check only"}

### 5. Best Practices
- Check adherence to ${language} best practices
- Identify design pattern opportunities
- Evaluate error handling
- Check for proper use of language features

### 6. Specific Recommendations
- Provide actionable improvement suggestions
- Prioritize recommendations by impact
- Include code examples where applicable

## Output Format:
Please structure your response with clear sections and actionable insights. For each issue found, provide:
1. Description of the issue
2. Why it matters
3. Specific code location (if applicable)
4. Recommended solution with code example

## Additional Context:
- Language: ${language}
- Primary focus: ${focus}
- Analysis type: Comprehensive code review with AI assistance

---

*Note: This analysis is part of an automated code quality improvement workflow. Focus on providing practical, implementable suggestions.*
`;

  return prompt;
}

function getFocusAreas(focus: string): string[] {
  const allAreas = [
    "Code Quality & Structure",
    "Security Vulnerabilities",
    "Performance & Efficiency",
    "Maintainability & Readability",
    "Best Practices & Patterns",
    "Error Handling",
    "Testing Opportunities",
    "Documentation Quality",
  ];

  const focusMap: Record<string, string[]> = {
    security: [
      "Security Vulnerabilities",
      "Input Validation",
      "Authentication & Authorization",
      "Data Protection",
      "Common Security Anti-patterns",
    ],
    performance: [
      "Performance Bottlenecks",
      "Algorithmic Efficiency",
      "Memory Usage",
      "Optimization Opportunities",
      "Caching Strategies",
    ],
    maintainability: [
      "Code Readability",
      "Design Patterns",
      "Technical Debt",
      "Refactoring Opportunities",
      "Documentation",
    ],
    all: allAreas,
  };

  return focusMap[focus] || allAreas;
}

/**
 * Generates a prompt specifically for refactoring suggestions
 */
export function generateRefactoringPrompt(
  code: string,
  language: string
): string {
  return `As an expert code reviewer, please analyze this ${language} code and suggest refactoring improvements:

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. Specific refactoring opportunities with before/after examples
2. Design pattern recommendations
3. Code smell identification
4. Modernization suggestions for ${language}
5. Priority ranking of suggestions

Focus on practical improvements that enhance:
- Readability
- Maintainability
- Performance
- Testability
- Reusability`;
}

/**
 * Generates a prompt for architecture review
 */
export function generateArchitecturePrompt(
  files: Array<{ filename: string; code: string; language: string }>
): string {
  const filesList = files
    .map(
      (f) => `
### ${f.filename}
\`\`\`${f.language}
${f.code}
\`\`\`
`
    )
    .join("\n");

  return `# Multi-File Architecture Analysis

Please review the following codebase structure and provide architectural insights:

${filesList}

## Analysis Required:

1. **Architecture Patterns**
   - Identify current architectural patterns
   - Suggest improvements or alternatives
   - Evaluate separation of concerns

2. **Dependencies**
   - Analyze inter-file dependencies
   - Identify circular dependencies
   - Suggest dependency improvements

3. **Code Organization**
   - Evaluate module structure
   - Suggest better organization
   - Identify coupling issues

4. **Scalability**
   - Assess scalability potential
   - Identify scalability bottlenecks
   - Suggest improvements for growth

5. **Best Practices**
   - Evaluate adherence to SOLID principles
   - Check design pattern usage
   - Assess overall code quality

Please provide prioritized, actionable recommendations with specific examples.`;
}

/**
 * Generates a prompt for security-focused analysis
 */
export function generateSecurityPrompt(code: string, language: string): string {
  return `# Security Analysis Request

Please perform a thorough security analysis of this ${language} code:

\`\`\`${language}
${code}
\`\`\`

## Security Checklist:

### 1. Input Validation
- Check for unvalidated user input
- Verify proper sanitization
- Assess injection vulnerability risks

### 2. Authentication & Authorization
- Evaluate authentication mechanisms
- Check authorization logic
- Identify privilege escalation risks

### 3. Data Protection
- Check for sensitive data exposure
- Evaluate encryption usage
- Assess data storage security

### 4. Common Vulnerabilities
- SQL Injection
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Command Injection
- Path Traversal
- Insecure Deserialization

### 5. Error Handling
- Check for information disclosure in errors
- Evaluate exception handling
- Assess logging practices

### 6. Dependencies
- Identify potential vulnerable dependencies
- Check for outdated libraries

For each finding, provide:
- Severity level (Critical/High/Medium/Low)
- Detailed description
- Code location
- Remediation steps with code examples
- CWE reference if applicable

Prioritize findings by severity and likelihood of exploitation.`;
}
