import { connectToMongoDB } from "../db.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export const getInfoTool = {
    name: "get-info",
    description: "Retrieve information about database like name, size, collection stats",
    run: async (): Promise<CallToolResult> => {
        try {

            const dbInstance = await connectToMongoDB();

            const dbStats = await dbInstance.stats();

            const collections = await dbInstance.listCollections().toArray();

            const info = {
                databaseName: dbInstance.databaseName,
                dataSize: dbStats.dataSize,
                storageSize: dbStats.storageSize,
                totalCollections: dbStats.collections,
                totalObject: dbStats.objects,
                collections: collections
            }

            return {
                isError: false,
                content: [
                    {
                        type: "text" as const,
                        text: JSON.stringify(info)
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