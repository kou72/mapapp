// REST API の PUT メソッドで発火する Lambda 関数
// DynamoDB のテーブルにアイテムを追加する
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

const putItem = async (ddBpin) => {
  const command = new PutItemCommand({
    TableName: "mapapp-db",
    Item: ddBpin,
  });
  await client.send(command);
};

export const handler = async (event) => {
  try {
    const ddBpin = JSON.parse(event.body);
    await putItem(ddBpin);

    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: "Created" }),
      headers: { "Access-Control-Allow-Origin": "*" },
    };
    return response;
  } catch (error) {
    console.error("Error putting item:", error);
    const response = {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
      headers: { "Access-Control-Allow-Origin": "*" },
    };
    return response;
  }
};
