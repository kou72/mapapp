// Websocket の切断時に呼ばれる Lambda 関数
// DynamoDB のテーブルから接続idを削除する
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event) => {
  try {
    const connectionId = event.requestContext.connectionId;

    await client.send(
      new DeleteCommand({
        TableName: "mapapp-connection",
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
