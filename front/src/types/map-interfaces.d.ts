export interface Center {
  lat: number;
  lng: number;
}

export type ColorCode = "red" | "blue" | "green" | "yellow";

export type Position = {
  lat: number;
  lng: number;
};

export interface Pin {
  id: string;
  name: string;
  group: string;
  color?: ColorCode;
  position?: Position;
}

export interface DynamoDbPin {
  group: { S: string };
  id: { S: string };
  name: { S: string };
  position: {
    M: {
      lng: { N: string };
      lat: { N: string };
    };
  };
  color: { S: ColorCode };
}

export type OperationCode = "INSERT" | "MODIFY" | "REMOVE";

export interface PinStream {
  operation: OperationCode;
  item?: Pin;
  id: string;
}
