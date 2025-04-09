import { z } from "zod";
import { connectToMongoDB } from "../db.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export const UpdateDocumentSchema = z.object({
    collection: z.string(),
    filter: z.record(z.any()),
    update: z.record(z.any()),
});

type UpdateDocumentInput = z.infer<typeof UpdateDocumentSchema>;

export const updateDocumentsTool = {
    name: "update-documents",
    description: "Update existing one or many documents into a specified MongoDB Collection",
    inputSchemas: {
        inputSchema: UpdateDocumentSchema
    },
    run: async (args: { inputSchema: UpdateDocumentInput }): Promise<CallToolResult> => {
        try {
            const { collection, filter, update } = args.inputSchema;

            const dbInstance = await connectToMongoDB();

            const result = await dbInstance.collection(collection).updateMany(filter, update)

            const responseText = `Updated ${result.modifiedCount} document(s) out of ${result.matchedCount} matched`;

            return {
                isError: false,
                content: [
                    {
                        type: "text" as const,
                        text: responseText
                    }
                ]
            }
        } catch (error: any) {
            return {
                isError: true,
                content: [
                    {
                        type: "text" as const,
                        text: `Error updating document: ${error.message}`
                    }
                ]
            }
        }
    }
}