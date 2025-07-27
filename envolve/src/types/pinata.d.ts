declare module '@pinata/sdk' {
  interface PinataResponse {
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;
  }

  interface PinataOptions {
    pinataMetadata?: {
      name?: string;
      keyvalues?: Record<string, string>;
    };
    pinataOptions?: {
      cidVersion?: 0 | 1;
    };
  }

  export default class PinataSDK {
    constructor(apiKey: string, secretApiKey: string);
    pinFileToIPFS(
      readableStream: any,
      options?: PinataOptions
    ): Promise<PinataResponse>;
    pinJSONToIPFS(
      body: any,
      options?: PinataOptions
    ): Promise<PinataResponse>;
  }
}