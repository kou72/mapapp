import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event) => {
  try {
    const connectionId = event.requestContext.connectionId;

    await client.send(
      new DeleteCommand({
        TableName: "WebSocketConnections",
        Key: {
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
