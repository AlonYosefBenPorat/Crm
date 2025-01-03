import { BlobServiceClient } from '@azure/storage-blob';
import config from '../../config.json';

const { accountName, containerName, sasToken } = config;

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net?${sasToken}`
);

const containerClient = blobServiceClient.getContainerClient(containerName);

export const uploadImage = async (file: File) => {
  const blobName = new Date().getTime() + '-' + file.name;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(file, {
    blobHTTPHeaders: { blobContentType: file.type }
  });

  return blockBlobClient.url;
};