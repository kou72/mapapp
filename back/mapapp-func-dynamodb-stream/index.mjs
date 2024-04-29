// DynamoDB Stream からのイベントを受け取り発火する Lambda 関数
// テーブル操作を mapapp-connection にある接続idに対して通知する
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

const dynamodbClient = new DynamoDBClient({});
const apigwClient = new ApiGatewayManagementApiClient({
  endpoint: process.env.API_GATEWAY_ENDPOINT,
});

export const handler = async (event) => {
  try {
    const record = event.Records[0];
    const operation = record.eventName;
    const keys = record.dynamodb.Keys;
    const item = record.dynamodb.NewImage;

    const data = await dynamodbClient.send(
      new ScanCommand({
        TableName: "mapapp-connection",
      })
    );

    const streamData = data.Items.map(async (connection) => {
      await apigwClient.send(
        new PostToConnectionCommand({
          ConnectionId: connection.connectionId,
          Data: JSON.stringify({
            operation: operation,
            key: keys,
            item: item,
          }),
        })
      );
    });

    await Promise.all(streamData);

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
