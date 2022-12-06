export interface BedrockConversion {
  conversions: {
    [key: string]: {
      id: string;
      data?: number;
    };
  };
  ignore: string[];
}
