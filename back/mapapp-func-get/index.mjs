import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

const scanTable = async () => {
  const command = new ScanCommand({
    TableName: "mapapp-db",
  });
  const data = await client.send(command);
  return data.Items;
};

export const handler = async (event) => {
  try {
    const items = await scanTable();
    const response = {
      statusCode: 200,
      body: JSON.stringify(items),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
    return response;
  } catch (error) {
    console.error("Error scanning table:", error);
    const response = {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
    return response;
  }
};
