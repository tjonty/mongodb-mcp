import { z } from "zod";
import { connectToMongoDB } from "../db.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export const InsertDocumentSchema = z.object({
    collection: z.string(),
    documents: z.union([
        z.record(z.any()),
        z.array(z.record(z.any())),
    ]),
});

type InsertDocumentInput = z.infer<typeof InsertDocumentSchema>;

export const insertDocumentsTool = {
    name: "insert-documents",
    description: "Insert new one or many documents into a specified MongoDB Collection",
    inputSchemas: {
        inputSchema: InsertDocumentSchema
    },
    run: async (args: { inputSchema: InsertDocumentInput }): Promise<CallToolResult> => {
        try {
            const { collection, documents } = args.inputSchema;

            const dbInstance = await connectToMongoDB();

            const docsArray = Array.isArray(documents) ? [...documents] : [documents];
            const result = await dbInstance.collection(collection).insertMany(docsArray);

            const responseText = `Inserted ${result.insertedCount} document(s) with IDs: ${Object.values(result.insertedIds).join(", ")}`;

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
                        text: `Error inserting document: ${error.message}`
                    }
                ]
            }
        }
    }
}