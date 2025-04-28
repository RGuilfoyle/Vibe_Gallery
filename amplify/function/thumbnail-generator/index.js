const sharp = require('sharp');
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client();

// Get thumbnail dimensions from environment variables or use defaults
const THUMBNAIL_WIDTH = parseInt(process.env.THUMBNAIL_WIDTH || '200', 10);
const THUMBNAIL_HEIGHT = parseInt(process.env.THUMBNAIL_HEIGHT || '200', 10);

/**
 * Process an S3 event record to generate a thumbnail
 */
async function processRecord(record) {
  // Get bucket and key from the event
  const bucket = record.s3.bucket.name;
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
  
  // Skip processing if this is already a thumbnail
  if (key.includes('/thumbnails/')) {
    console.log(`Skipping thumbnail processing for ${key}`);
    return;
  }
  
  try {
    console.log(`Processing ${key} from bucket ${bucket}`);
    
    // Generate the thumbnail key
    const thumbnailKey = key.replace('photos/', 'photos/thumbnails/');
    
    // Get the image from S3
    const getObjectParams = {
      Bucket: bucket,
      Key: key,
    };
    
    const { Body, ContentType } = await s3Client.send(new GetObjectCommand(getObjectParams));
    
    if (!Body) {
      throw new Error('Empty object body');
    }
    
    // Convert the S3 stream to a buffer
    const imageBuffer = await streamToBuffer(Body);
    
    // Generate thumbnail using sharp
    const thumbnailBuffer = await sharp(imageBuffer)
      .resize({
        width: THUMBNAIL_WIDTH,
        height: THUMBNAIL_HEIGHT,
        fit: 'cover',
        position: 'center',
      })
      .toBuffer();
    
    // Upload the thumbnail to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: thumbnailKey,
        Body: thumbnailBuffer,
        ContentType: ContentType,
        Metadata: {
          'x-amz-meta-thumbnail': 'true',
          'x-amz-meta-original-key': key,
        },
      })
    );
    
    console.log(`Successfully generated thumbnail: ${thumbnailKey}`);
    
  } catch (error) {
    console.error(`Error processing ${key}:`, error);
    throw error;
  }
}

/**
 * Convert a readable stream to a buffer
 */
async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

/**
 * Lambda handler function
 */
exports.handler = async function(event) {
  console.log('Processing S3 event:', JSON.stringify(event, null, 2));
  
  // Process each record in the event
  const processPromises = event.Records.map(processRecord);
  
  try {
    await Promise.all(processPromises);
    console.log('Successfully processed all records');
  } catch (error) {
    console.error('Error processing records:', error);
    throw error;
  }
};
