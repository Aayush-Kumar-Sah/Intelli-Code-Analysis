#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { analyzeCode } from "./analyzer.js";
import { detectCodeSmells } from "./code-smells.js";
import { suggestRefactorings } from "./refactorings.js";
import { analyzeComplexity } from "./complexity.js";
import { generateAIPrompt } from "./ai-integration.js";

const server = new Server(
  {
    name: "intelli-code-analysis-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handler for listing available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "analyze_code",
        description:
          "Analyzes code for quality metrics, complexity, and potential issues. Supports multiple files.",
        inputSchema: {
          type: "object",
          properties: {
            code: {
              type: "string",
              description: "The source code to analyze",
            },
            language: {
              type: "string",
              description: "Programming language (javascript, typescript, python, java, etc.)",
              default: "javascript",
            },
            filename: {
              type: "string",
              description: "Optional filename for context",
            },
          },
          required: ["code"],
        },
      },
      {
        name: "detect_code_smells",
        description:
          "Detects common code smells and anti-patterns in the provided code.",
        inputSchema: {
          type: "object",
          properties: {
            code: {
              type: "string",
              description: "The source code to analyze for code smells",
            },
            language: {
              type: "string",
              description: "Programming language",
              default: "javascript",
            },
          },
          required: ["code"],
        },
      },
      {
        name: "suggest_refactorings",
        description:
          "Suggests refactoring opportunities to improve code quality and maintainability.",
        inputSchema: {
          type: "object",
          properties: {
            code: {
              type: "string",
              description: "The source code to analyze for refactoring opportunities",
            },
            language: {
              type: "string",
              description: "Programming language",
              default: "javascript",
            },
          },
          required: ["code"],
        },
      },
      {
        name: "analyze_complexity",
        description:
          "Analyzes code complexity metrics including cyclomatic complexity, cognitive complexity, and nesting depth.",
        inputSchema: {
          type: "object",
          properties: {
            code: {
              type: "string",
              description: "The source code to analyze",
            },
            language: {
              type: "string",
              description: "Programming language",
              default: "javascript",
            },
          },
          required: ["code"],
        },
      },
      {
        name: "analyze_multiple_files",
        description:
          "Analyzes multiple code files at once, providing cross-file insights and dependency analysis.",
        inputSchema: {
          type: "object",
          properties: {
            files: {
              type: "array",
              description: "Array of files to analyze",
              items: {
                type: "object",
                properties: {
                  filename: {
                    type: "string",
                    description: "Name of the file",
                  },
                  code: {
                    type: "string",
                    description: "Content of the file",
                  },
                  language: {
                    type: "string",
                    description: "Programming language",
                  },
                },
                required: ["filename", "code"],
              },
            },
          },
          required: ["files"],
        },
      },
      {
        name: "generate_ai_analysis_prompt",
        description:
          "Generates a comprehensive prompt for AI models (GPT/Claude) to perform deep code analysis. Useful for integrating with external AI services.",
        inputSchema: {
          type: "object",
          properties: {
            code: {
              type: "string",
              description: "The source code to generate analysis prompt for",
            },
            language: {
              type: "string",
              description: "Programming language",
              default: "javascript",
            },
            focus: {
              type: "string",
              description: "Focus area: 'security', 'performance', 'maintainability', 'all'",
              default: "all",
            },
          },
          required: ["code"],
        },
      },
    ],
  };
});

/**
 * Handler for tool execution
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "analyze_code": {
        const { code, language = "javascript", filename = "unknown" } = args as {
          code: string;
          language?: string;
          filename?: string;
        };
        const analysis = analyzeCode(code, language, filename);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(analysis, null, 2),
            },
          ],
        };
      }

      case "detect_code_smells": {
        const { code, language = "javascript" } = args as {
          code: string;
          language?: string;
        };
        const smells = detectCodeSmells(code, language);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(smells, null, 2),
            },
          ],
        };
      }

      case "suggest_refactorings": {
        const { code, language = "javascript" } = args as {
          code: string;
          language?: string;
        };
        const refactorings = suggestRefactorings(code, language);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(refactorings, null, 2),
            },
          ],
        };
      }

      case "analyze_complexity": {
        const { code, language = "javascript" } = args as {
          code: string;
          language?: string;
        };
        const complexity = analyzeComplexity(code, language);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(complexity, null, 2),
            },
          ],
        };
      }

      case "analyze_multiple_files": {
        const { files } = args as {
          files: Array<{
            filename: string;
            code: string;
            language?: string;
          }>;
        };

        const results = files.map((file) => ({
          filename: file.filename,
          analysis: analyzeCode(
            file.code,
            file.language || "javascript",
            file.filename
          ),
          smells: detectCodeSmells(file.code, file.language || "javascript"),
          complexity: analyzeComplexity(file.code, file.language || "javascript"),
        }));

        const summary = {
          totalFiles: files.length,
          totalLines: files.reduce(
            (sum, f) => sum + f.code.split("\n").length,
            0
          ),
          fileResults: results,
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(summary, null, 2),
            },
          ],
        };
      }

      case "generate_ai_analysis_prompt": {
        const { code, language = "javascript", focus = "all" } = args as {
          code: string;
          language?: string;
          focus?: string;
        };
        const prompt = generateAIPrompt(code, language, focus);
        return {
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        };
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new McpError(
      ErrorCode.InternalError,
      `Tool execution failed: ${errorMessage}`
    );
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Only log to stderr in development mode
  if (process.env.NODE_ENV === "development") {
    console.error("Intelli Code Analysis MCP Server running on stdio");
  }
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
