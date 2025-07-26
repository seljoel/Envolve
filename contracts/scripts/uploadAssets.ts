import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import FormData from 'form-data';

// Load environment variables
dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY!;
const PINATA_SECRET = process.env.PINATA_SECRET_API_KEY!;

// Configure Axios for Pinata
const pinata = axios.create({
  baseURL: 'https://api.pinata.cloud',
  headers: {
    'pinata_api_key': PINATA_API_KEY,
    'pinata_secret_api_key': PINATA_SECRET
  }
});

interface UploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

async function uploadFile(filePath: string): Promise<UploadResponse> {
  const formData = new FormData();
  const fileStream = fs.createReadStream(filePath);
  
  formData.append('file', fileStream, {
    filename: path.basename(filePath),
    knownLength: fs.statSync(filePath).size
  });

  formData.append('pinataMetadata', JSON.stringify({
    name: path.basename(filePath),
    keyvalues: {
      project: 'Envolve',
      type: path.extname(filePath).slice(1) === 'json' ? 'metadata' : 'asset'
    }
  }));

  try {
    const response = await pinata.post('/pinning/pinFileToIPFS', formData, {
      headers: {
        ...formData.getHeaders(),
        'Content-Type': 'multipart/form-data'
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    return response.data;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error instanceof Error ? error.message : error);
    throw error;
  }
}

async function updateMetadataWithImageCID(metadataPath: string, imageCID: string) {
  try {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    const imageName = path.basename(metadataPath).replace('.json', '.jpg');
    metadata.image = `ipfs://${imageCID}/${imageName}`;
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  } catch (error) {
    console.error(`Error updating metadata ${metadataPath}:`, error instanceof Error ? error.message : error);
    throw error;
  }
}

async function uploadAssets() {
  try {
    // 1. Upload Images First
    console.log('Uploading images to Pinata...');
    const imageUploads = [
      { stage: 'stage0', path: path.join(__dirname, '../assets/stage0.jpg') },
      { stage: 'stage1', path: path.join(__dirname, '../assets/stage1.jpg') },
      { stage: 'stage2', path: path.join(__dirname, '../assets/stage2.jpg') }
    ];

    const imageCIDs: Record<string, string> = {};

    for (const upload of imageUploads) {
      const result = await uploadFile(upload.path);
      imageCIDs[upload.stage] = result.IpfsHash;
      console.log(`✅ ${upload.stage}.jpg uploaded: ipfs://${result.IpfsHash}`);
    }

    // 2. Update Metadata with Image CIDs
    console.log('\nUpdating metadata files...');
    const metadataFiles = [
      { stage: 'stage0', path: path.join(__dirname, '../assets/stage0.json') },
      { stage: 'stage1', path: path.join(__dirname, '../assets/stage1.json') },
      { stage: 'stage2', path: path.join(__dirname, '../assets/stage2.json') }
    ];

    for (const file of metadataFiles) {
      await updateMetadataWithImageCID(file.path, imageCIDs[file.stage]);
      console.log(`🔄 ${file.stage}.json updated with image CID`);
    }

    // 3. Upload Updated Metadata
    console.log('\nUploading metadata to Pinata...');
    const metadataCIDs: Record<string, string> = {};

    for (const file of metadataFiles) {
      const result = await uploadFile(file.path);
      metadataCIDs[file.stage] = result.IpfsHash;
      console.log(`📄 ${file.stage}.json uploaded: ipfs://${result.IpfsHash}`);
    }

    // 4. Generate Deployment Configuration
    console.log('\n🚀 Deployment-ready URIs:');
    for (const [stage, cid] of Object.entries(metadataCIDs)) {
      console.log(`- ${stage}: ipfs://${cid}/${stage}.json`);
    }

    // 5. Verify on Pinata Gateway
    console.log('\n🔍 Verification URLs:');
    for (const [stage, cid] of Object.entries(metadataCIDs)) {
      console.log(`- ${stage}: https://gateway.pinata.cloud/ipfs/${cid}`);
    }

    return metadataCIDs;

  } catch (error) {
    console.error('❌ Upload failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Execute
uploadAssets().then(metadataCIDs => {
  console.log('\n✨ Upload process completed successfully!');
  console.log('Metadata CIDs:', metadataCIDs);
});