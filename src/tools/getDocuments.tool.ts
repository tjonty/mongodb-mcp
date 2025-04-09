import { z } from "zod";
import { connectToMongoDB } from "../db.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export const GetDocumentsSchema = z.object({
    collection: z.string(),
    query: z.record(z.any()).optional(),
    limit: z.number().optional(),
    skip: z.number().optional()
});

type GetDocumentsInput = z.infer<typeof GetDocumentsSchema>;

export const getDocumentsTool = {
    name: "get-documents",
    description: "Retrieve documents from a specified collection with optional query, skip, and limit",
    inputSchemas: {
        inputSchema: GetDocumentsSchema,
    },
    run: async (args: { inputSchema: GetDocumentsInput }): Promise<CallToolResult> => {
        try {
            const { collection, query, limit, skip } = args.inputSchema;

            const dbInstance = await connectToMongoDB();

            const cursor = dbInstance.collection(collection).find(query || {});

            if (skip) cursor.skip(skip);
            if (limit) cursor.limit(limit);

            const docs = await cursor.toArray();

            return {
                isError: false,
                content: [
                    {
                        type: "text" as const,
                        text: JSON.stringify(docs)
                    }
                ]
            }
        } catch (error: any) {
            return {
                isError: true,
                content: [
                    {
                        type: "text" as const,
                        text: `Error fetching documents: ${error.message}`
                    }
                ]
            }
        }
    }
}