import pinataSDK from '@pinata/sdk';
import fs from 'fs';
import path from 'path';

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY!,
  process.env.PINATA_SECRET_API_KEY!
);

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export async function uploadToPinata(): Promise<string> {
  const imagePath = path.join(__dirname, '../assets/stage0.png');
  const metadataPath = path.join(__dirname, '../assets/stage0.json');
  
  // Upload image
  const imageStream = fs.createReadStream(imagePath);
  const imageRes: PinataResponse = await pinata.pinFileToIPFS(imageStream);
  
  // Update metadata
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
  metadata.image = `ipfs://${imageRes.IpfsHash}`;
  
  // Upload metadata
  const metadataRes: PinataResponse = await pinata.pinJSONToIPFS(metadata);
  return `ipfs://${metadataRes.IpfsHash}`;
}