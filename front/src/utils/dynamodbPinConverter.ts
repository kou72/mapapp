import { Pin, DynamoDbPin, PinStream } from "@/types/map-interfaces";

export const converteDdbPinToPin = (item: DynamoDbPin): Pin => {
  const pin: Pin = {
    id: item.id.S,
    name: item.name.S,
    group: item.group.S,
    color: item.color.S,
    position: {
      lat: parseFloat(item.position.M.lat.N),
      lng: parseFloat(item.position.M.lng.N),
    },
  };
  return pin;
};

export const converteDdbPinsToPins = (dynamoDbData: DynamoDbPin[]) => {
  const data: Pin[] = dynamoDbData.map((item: DynamoDbPin) => {
    return converteDdbPinToPin(item);
  });
  return data;
};

export const converteDdbStreamToPinStream = (dbStream: MessageEvent) => {
  const data = JSON.parse(dbStream.data);
  const pinStream: PinStream = {
    operation: data.operation,
    item: data.item ? converteDdbPinToPin(data.item) : undefined,
    id: data.key.id.S,
  };
  return pinStream;
};

export const convertPinToDdbPin = (pin: Pin) => {
  if (!pin.position) return;
  const ddbPin = {
    id: { S: pin.id },
    name: { S: pin.name },
    group: { S: pin.group },
    color: { S: pin.color },
    position: {
      M: {
        lat: { N: pin.position.lat.toString() },
        lng: { N: pin.position.lng.toString() },
      },
    },
  };
  return ddbPin;
};
