// REST API の DELETE メソッドで発火する Lambda 関数
// DynamoDB のテーブルからアイテムを削除する
import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

const deleteItem = async (id) => {
  const command = new DeleteItemCommand({
    TableName: "mapapp-db",
    Key: {
      id: { S: id },
    },
  });
  await client.send(command);
};

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    await deleteItem(body.id);
    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: "Deleted" }),
      headers: { "Access-Control-Allow-Origin": "*" },
    };
    return response;
  } catch (error) {
    console.error("Error deleting item:", error);
    const response = {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
      headers: { "Access-Control-Allow-Origin": "*" },
    };
    return response;
  }
};
