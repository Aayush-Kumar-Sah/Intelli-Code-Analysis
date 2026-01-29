# Intelli-Code-Analysis MCP Server

An intelligent Model Context Protocol (MCP) server that enables AI agents to analyze codebases, detect code smells, suggest refactorings, and perform intelligent code transformations.

## 🚀 Features

- **MCP Server Implementation**: Full Model Context Protocol server with stdio transport
- **Code Analysis Tools**: Comprehensive code quality metrics and analysis
- **Multi-File Support**: Analyze multiple files simultaneously with cross-file insights
- **AI Integration**: Generate prompts for GPT/Claude for deep code analysis
- **Code Smell Detection**: Identify 10+ types of code smells and anti-patterns
- **Refactoring Suggestions**: Intelligent refactoring recommendations
- **Complexity Analysis**: Cyclomatic, cognitive, and Halstead complexity metrics
- **Multi-Language Support**: JavaScript, TypeScript, Python, Java, and more

## 📋 Requirements

- Node.js 18+ 
- npm or yarn

## 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/Aayush-Kumar-Sah/Intelli-Code-Analysis.git
cd Intelli-Code-Analysis

# Install dependencies
npm install

# Build the project
npm run build
```

## 🎯 Usage

### As an MCP Server

Add to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "intelli-code-analysis": {
      "command": "node",
      "args": ["/path/to/Intelli-Code-Analysis/dist/index.js"]
    }
  }
}
```

### Available Tools

#### 1. `analyze_code`
Analyzes code for quality metrics, complexity, and potential issues.

```json
{
  "code": "function example() { return 42; }",
  "language": "javascript",
  "filename": "example.js"
}
```

#### 2. `detect_code_smells`
Detects common code smells and anti-patterns.

```json
{
  "code": "function veryLongFunction() { /* 100 lines */ }",
  "language": "javascript"
}
```

#### 3. `suggest_refactorings`
Suggests refactoring opportunities to improve code quality.

```json
{
  "code": "const temp = getData();",
  "language": "javascript"
}
```

#### 4. `analyze_complexity`
Analyzes code complexity metrics including cyclomatic and cognitive complexity.

```json
{
  "code": "function complex() { if (a && b || c) { for(;;) {} } }",
  "language": "javascript"
}
```

#### 5. `analyze_multiple_files`
Analyzes multiple code files at once with cross-file insights.

```json
{
  "files": [
    {
      "filename": "utils.js",
      "code": "export function add(a, b) { return a + b; }",
      "language": "javascript"
    },
    {
      "filename": "main.js",
      "code": "import { add } from './utils.js';",
      "language": "javascript"
    }
  ]
}
```

#### 6. `generate_ai_analysis_prompt`
Generates comprehensive prompts for AI models (GPT/Claude).

```json
{
  "code": "function secure(input) { return eval(input); }",
  "language": "javascript",
  "focus": "security"
}
```

**Focus Options**: `all`, `security`, `performance`, `maintainability`

## 🧪 Testing

Run the comprehensive test suite (10 test cases):

```bash
npm test
```

### Test Cases Coverage

1. ✅ Basic Code Analysis - Simple Function
2. ✅ Code Smell Detection - Long Method
3. ✅ Code Smell Detection - Magic Numbers
4. ✅ Refactoring Suggestions - Extract Method
5. ✅ Refactoring Suggestions - Variable Naming
6. ✅ Complexity Analysis - High Cyclomatic Complexity
7. ✅ Multi-file Analysis
8. ✅ Python Code Analysis
9. ✅ AI Prompt Generation - All Focus
10. ✅ AI Prompt Generation - Security Focus

## 📁 Project Structure

```
Intelli-Code-Analysis/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── analyzer.ts           # Core code analysis
│   ├── code-smells.ts        # Code smell detection
│   ├── refactorings.ts       # Refactoring suggestions
│   ├── complexity.ts         # Complexity analysis
│   ├── ai-integration.ts     # AI prompt generation
│   └── test/
│       └── test-suite.ts     # Test suite (10 cases)
├── examples/
│   ├── good-code.js          # Example of well-written code
│   ├── bad-code.js           # Example with code smells
│   └── python-issues.py      # Python code examples
├── package.json
├── tsconfig.json
└── README.md
```

## 🔍 Code Smells Detected

- Long Methods (>50 lines)
- Long Parameter Lists (>5 parameters)
- Duplicate Code
- Dead Code
- Magic Numbers
- Deeply Nested Loops
- God Class (>20 methods)
- Large Class (>500 lines)
- Primitive Obsession
- Long Switch Statements (>7 cases)

## 🔄 Refactoring Suggestions

- Extract Method
- Rename Variable
- Introduce Parameter
- Replace Conditional
- Simplify Expression
- Encapsulate Field
- Remove Duplication
- Modern Syntax Updates

## 📊 Complexity Metrics

- **Cyclomatic Complexity**: Measures code path complexity
- **Cognitive Complexity**: Measures code understandability
- **Nesting Depth**: Maximum nesting level
- **Halstead Metrics**: Vocabulary, length, difficulty, effort
- **Maintainability Index**: 0-100 scale (higher is better)

## 🤖 AI Integration

The server generates comprehensive prompts for external AI services:

- **Security Analysis**: Vulnerability detection, OWASP checks
- **Performance Analysis**: Bottleneck identification, optimization
- **Maintainability Analysis**: Code quality, technical debt
- **Architecture Review**: Multi-file structure analysis

## 📚 Examples

Check the `examples/` directory for sample code files:

- `good-code.js` - Well-structured JavaScript code
- `bad-code.js` - Code with various smells and issues
- `python-issues.py` - Python code examples

## 🌐 Supported Languages

- JavaScript
- TypeScript
- Python
- Java
- (Extensible to other languages)

## 🛠️ Development

```bash
# Build the project
npm run build

# Run tests
npm test

# Run in development
npm run prepare
```

## 📄 License

MIT

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Issues

If you encounter any issues, please file them on the [GitHub Issues](https://github.com/Aayush-Kumar-Sah/Intelli-Code-Analysis/issues) page.

## 📝 Notes

- This MCP server acts as a bridge between AI agents and code analysis tools
- It provides structured data that AI agents can use to provide intelligent insights
- The AI integration feature generates prompts that can be sent to GPT or Claude for deeper analysis
- All analysis is performed locally without sending code to external services (unless using AI prompt feature)