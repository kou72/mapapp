import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

export const handler = async (event) => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  const getCommand = new GetCommand({
    TableName: "mapapp-db",
    Key: {
      id: 1,
    },
  });

  const response = await docClient.send(getCommand);
  const connectionId = event.requestContext.connectionId;

  let connectionIds = response.Item.connection_ids;

  connectionIds.push(connectionId);

  const putCommand = new PutCommand({
    TableName: "message_rooms",
    Item: {
      ...response.Item,
      connection_ids: connectionIds,
    },
  });

  await docClient.send(putCommand);

  return {
    statusCode: 200,
  };
};
