import { z } from "zod";
import { connectToMongoDB } from "../db.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export const CreateCollectionSchema = z.object({
    collectionName: z.string(),
    options: z.record(z.any().optional())
});

type CreateCollectionInput = z.infer<typeof CreateCollectionSchema>;

export const createCollectionTool = {
    name: "create-collection",
    description: "Explicitly create a new MongoDB collection with optional options.",
    inputSchemas: {
        inputSchema: CreateCollectionSchema
    },
    run: async (args: { inputSchema: CreateCollectionInput }): Promise<CallToolResult> => {
        try {
            const { collectionName, options } = args.inputSchema;

            const dbInstance = await connectToMongoDB();

            const newCollection = await dbInstance.createCollection(collectionName, options)

            return {
                isError: false,
                content: [
                    {
                        type: "text" as const,
                        text: `Collection ${collectionName} created successfully.`
                    }
                ]
            }
        } catch (error: any) {
            return {
                isError: true,
                content: [
                    {
                        type: "text" as const,
                        text: `Error creating collection: ${error.message}`
                    }
                ]
            }
        }
    }
}