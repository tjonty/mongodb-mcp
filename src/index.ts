import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "dotenv";
import { getDocumentsTool } from "./tools/getDocuments.tool.js";
import { insertDocumentsTool } from "./tools/insertDocuments.tool.js";
import { createCollectionTool } from "./tools/createCollection.tool.js";
import { updateDocumentsTool } from "./tools/updateDocuments.tool.js";
import { getInfoTool } from "./tools/getInfo.tool.js";

config();

// Initialize server
const server = new McpServer({
    name: "mongodb-server",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});

// Specify tools
server.tool(
    getInfoTool.name,
    getInfoTool.description,
    getInfoTool.run
)

server.tool(
    createCollectionTool.name,
    createCollectionTool.description,
    createCollectionTool.inputSchemas,
    createCollectionTool.run
)

server.tool(
    getDocumentsTool.name,
    getDocumentsTool.description,
    getDocumentsTool.inputSchemas,
    getDocumentsTool.run
)

server.tool(
    insertDocumentsTool.name,
    insertDocumentsTool.description,
    insertDocumentsTool.inputSchemas,
    insertDocumentsTool.run
)

server.tool(
    updateDocumentsTool.name,
    updateDocumentsTool.description,
    updateDocumentsTool.inputSchemas,
    updateDocumentsTool.run
)

// Establish Connection to MCP
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MongoDB MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});