import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event) => {
  try {
    const connectionId = event.requestContext.connectionId;

    await client.send(
      new PutCommand({
        TableName: "WebSocketConnections",
        Item: {
          connectionId: connectionId,
        },
      })
    );

    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
