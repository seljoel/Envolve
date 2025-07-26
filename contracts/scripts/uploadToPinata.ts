import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

const PINATA_API_KEY = process.env.PINATA_API_KEY!;
const PINATA_SECRET = process.env.PINATA_SECRET!;

async function uploadToPinata(filePath: string, name: string) {
  const data = new FormData();
  const file = fs.createReadStream(filePath);
  data.append('file', file, { filename: name });
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  const response = await axios.post(url, data, {
    headers: {
      ...data.getHeaders(),
      'pinata_api_key': PINATA_API_KEY,
      'pinata_secret_api_key': PINATA_SECRET
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  });

  return response.data.IpfsHash;
}

async function uploadAssets() {
  // Upload images
  const stage0ImageCid = await uploadToPinata('assets/stage0.png', 'stage0.png');
  
  // Create and upload metadata
  const metadata = {
    name: "Envolve - Stage 0",
    description: "Initial polluted state",
    image: `ipfs://${stage0ImageCid}`,
    attributes: [{ trait_type: "Stage", value: "0" }]
  };

  const metadataPath = 'assets/stage0.json';
  fs.writeFileSync(metadataPath, JSON.stringify(metadata));
  const metadataCid = await uploadToPinata(metadataPath, 'stage0.json');

  console.log(`Stage 0 Assets Uploaded:`);
  console.log(`- Image: ipfs://${stage0ImageCid}`);
  console.log(`- Metadata: ipfs://${metadataCid}`);
}

uploadAssets();