# Quick Start Guide

## Installation

```bash
# Clone the repository
git clone https://github.com/Aayush-Kumar-Sah/Intelli-Code-Analysis.git
cd Intelli-Code-Analysis

# Install dependencies
npm install

# Build the project
npm run build
```

## Running Tests

```bash
npm test
```

Expected output: All 10 tests pass ✅

## Using as an MCP Server

### Step 1: Configure Your MCP Client

For Claude Desktop, edit your config file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add this configuration:

```json
{
  "mcpServers": {
    "intelli-code-analysis": {
      "command": "node",
      "args": ["/absolute/path/to/Intelli-Code-Analysis/dist/index.js"]
    }
  }
}
```

### Step 2: Restart Claude Desktop

The MCP server will be available with the following tools:
- `analyze_code`
- `detect_code_smells`
- `suggest_refactorings`
- `analyze_complexity`
- `analyze_multiple_files`
- `generate_ai_analysis_prompt`

## Example Usage

### Analyze a Simple Function

```javascript
// Ask Claude to analyze this code
function calculateTotal(items) {
  let total = 0;
  for (let item of items) {
    total += item.price;
  }
  return total;
}
```

### Detect Code Smells

```javascript
// Ask Claude to detect smells in this code
function process(a, b, c, d, e, f, g) {
  const temp = a + b;
  return temp * 99;
}
```

### Get Refactoring Suggestions

Ask Claude: "What refactoring improvements can be made to this code?"

### Analyze Multiple Files

Ask Claude: "Analyze the code quality across utils.js and main.js"

## Running the Usage Example

```bash
node dist/usage-example.js
```

This will demonstrate all features with example code.

## Testing the MCP Server Directly

```bash
# Test the server responds
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js

# Test code analysis
echo '{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "analyze_code", "arguments": {"code": "function test() { return 42; }", "language": "javascript"}}}' | node dist/index.js
```

## Common Use Cases

### 1. Code Review
Ask Claude: "Review this code for quality and suggest improvements"

### 2. Security Analysis
Ask Claude: "Analyze this code for security vulnerabilities" (uses the security-focused AI prompt)

### 3. Performance Optimization
Ask Claude: "What performance improvements can be made?" (uses the performance-focused AI prompt)

### 4. Complexity Analysis
Ask Claude: "Calculate the complexity metrics for this code"

### 5. Multi-file Analysis
Ask Claude: "Analyze the overall code quality of my project" (provide multiple files)

## Supported Languages

- JavaScript
- TypeScript
- Python
- Java
- (Extensible to other languages)

## Troubleshooting

### MCP Server Not Found
- Check that the path in your config file is absolute
- Verify the dist/index.js file exists
- Run `npm run build` if needed

### Tests Failing
- Run `npm install` to ensure dependencies are installed
- Run `npm run build` to rebuild
- Check Node.js version (requires 18+)

### No Output from Server
- Check that stdio is not being blocked
- Ensure no console.log in production (only in NODE_ENV=development)

## Next Steps

1. Try the example files in `examples/` directory
2. Read the full README.md for detailed API documentation
3. Check IMPLEMENTATION_SUMMARY.md for technical details
4. Integrate with your AI workflow

## Support

For issues or questions:
- GitHub Issues: https://github.com/Aayush-Kumar-Sah/Intelli-Code-Analysis/issues
- Check the comprehensive README.md
- Review the usage-example.ts for code examples
