# Setup Guide - Intelli-Code-Analysis

This guide will help you get started with the Intelli-Code-Analysis MCP server.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: Comes with Node.js (or use yarn/pnpm)
- **Git**: For cloning the repository ([Download Git](https://git-scm.com/))

### Verify Prerequisites

Check your installations:

```bash
node --version    # Should be v18.0.0 or higher
npm --version     # Should be 9.0.0 or higher
git --version     # Any recent version
```

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Aayush-Kumar-Sah/Intelli-Code-Analysis.git
cd Intelli-Code-Analysis
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- TypeScript and related development dependencies

### Step 3: Build the Project

```bash
npm run build
```

This compiles TypeScript code from `src/` to `dist/` directory.

## Environment Configuration

### Optional Environment Variables

The project uses minimal environment configuration. Only one optional variable is available:

- **`NODE_ENV`**: Controls logging behavior
  - `production` (default): No debug logs, clean stdio for MCP communication
  - `development`: Enables debug logging to stderr

### Setting Up Environment

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` if you want to enable development logging:
   ```bash
   NODE_ENV=development
   ```

**Note**: For production use with MCP clients, keep `NODE_ENV` unset or set to `production` to avoid interfering with stdio communication.

## Starting the Project

The Intelli-Code-Analysis server can be used in several ways:

### Option 1: As an MCP Server with Claude Desktop

This is the primary use case - integrating with Claude Desktop or other MCP clients.

1. **Locate your MCP client configuration file:**
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. **Add the server configuration:**

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

   **Important**: Replace `/absolute/path/to/Intelli-Code-Analysis` with the actual path to your cloned repository.

3. **Find your absolute path:**
   ```bash
   # In the project directory, run:
   pwd
   # Copy the output and use it in your config
   ```

4. **Restart Claude Desktop**

5. **Verify the server is available:**
   - Open Claude Desktop
   - Look for the tools icon (🔧) or tools menu
   - You should see 6 available tools from intelli-code-analysis

### Option 2: Direct Command Line Testing

Test the server directly from the command line:

```bash
# Test tool listing
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js

# Test code analysis
echo '{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "analyze_code", "arguments": {"code": "function test() { return 42; }", "language": "javascript"}}}' | node dist/index.js
```

### Option 3: Using the Example Script

Run the usage example to see all features in action:

```bash
node dist/usage-example.js
```

This demonstrates all 6 tools with example code.

### Option 4: Development Mode

For development with debug logging:

```bash
NODE_ENV=development node dist/index.js
```

## Running Tests

Verify everything works by running the test suite:

```bash
npm test
```

Expected output:
```
✔ Basic Code Analysis - Simple Function
✔ Code Smell Detection - Long Method
✔ Code Smell Detection - Magic Numbers
✔ Refactoring Suggestions - Extract Method
✔ Refactoring Suggestions - Variable Naming
✔ Complexity Analysis - High Cyclomatic Complexity
✔ Multi-file Analysis
✔ Python Code Analysis
✔ AI Prompt Generation - All Focus
✔ AI Prompt Generation - Security Focus

10 tests passed
```

## Available Tools

Once the MCP server is running, you'll have access to these tools:

1. **`analyze_code`** - Comprehensive code quality metrics
2. **`detect_code_smells`** - Identify anti-patterns and code smells
3. **`suggest_refactorings`** - Get refactoring recommendations
4. **`analyze_complexity`** - Calculate complexity metrics
5. **`analyze_multiple_files`** - Cross-file analysis
6. **`generate_ai_analysis_prompt`** - Generate prompts for AI analysis

See [README.md](README.md) for detailed tool documentation and examples.

## Troubleshooting

### Build Issues

**Problem**: Build fails with TypeScript errors
```bash
# Clean and rebuild
rm -rf dist/
npm run build
```

**Problem**: Module not found errors
```bash
# Reinstall dependencies
rm -rf node_modules/
npm install
```

### MCP Server Issues

**Problem**: Claude Desktop doesn't show the tools

1. Check the path in your config is absolute and correct
2. Verify the build completed successfully:
   ```bash
   ls -la dist/index.js
   ```
3. Check the config file syntax is valid JSON
4. Restart Claude Desktop completely
5. Check Claude Desktop logs for errors

**Problem**: Server not responding

1. Test the server directly:
   ```bash
   echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js
   ```
2. If this works, the issue is with the MCP client configuration
3. If this fails, rebuild the project: `npm run build`

### Node.js Version Issues

**Problem**: Syntax errors or import issues

Make sure you're using Node.js 18+:
```bash
node --version
# If less than v18.0.0, upgrade Node.js
```

### Test Failures

**Problem**: Tests fail to run

1. Ensure the project is built:
   ```bash
   npm run build
   ```

2. Check Node.js version (requires 18+)

3. Run tests with more verbose output:
   ```bash
   NODE_ENV=development npm test
   ```

## Development Workflow

For contributors or developers working on the project:

```bash
# 1. Make changes to src/ files
vim src/analyzer.ts

# 2. Build the project
npm run build

# 3. Run tests
npm test

# 4. Test with MCP client or direct command
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js
```

## Next Steps

1. ✅ Installation complete
2. ✅ Tests passing
3. ✅ MCP server configured
4. 📚 Read [README.md](README.md) for detailed API documentation
5. 🚀 Try the example files in `examples/` directory
6. 📖 Review [QUICKSTART.md](QUICKSTART.md) for usage patterns
7. 🛠️ Integrate with your AI workflow

## Support

- **Issues**: [GitHub Issues](https://github.com/Aayush-Kumar-Sah/Intelli-Code-Analysis/issues)
- **Documentation**: [README.md](README.md)
- **Examples**: Check `examples/` directory
- **Code Examples**: Review `src/usage-example.ts`

## Additional Resources

- [Model Context Protocol (MCP) Documentation](https://modelcontextprotocol.io/)
- [Claude Desktop MCP Guide](https://docs.anthropic.com/claude/docs)
- [Project Repository](https://github.com/Aayush-Kumar-Sah/Intelli-Code-Analysis)

---

**Success Checklist:**
- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Project built (`npm run build`)
- [ ] Tests pass (`npm test`)
- [ ] MCP client configured (if using with Claude Desktop)
- [ ] Server responds to test commands

If you've completed all items, you're ready to use Intelli-Code-Analysis! 🎉
