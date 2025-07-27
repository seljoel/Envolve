import { useState, ChangeEvent } from 'react';
import axios from 'axios';

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export default function IPFSUploader() {
  const [file, setFile] = useState<File | null>(null);

  const uploadFile = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await axios.post<PinataResponse>(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log('IPFS Hash:', res.data.IpfsHash);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="uploader">
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload to IPFS</button>
    </div>
  );
}