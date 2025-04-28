// Test script for photo upload API
const { Amplify } = require('aws-amplify');
const { generateClient } = require('aws-amplify/data');
const { uploadData } = require('aws-amplify/storage');
const { signIn, fetchUserAttributes } = require('aws-amplify/auth');
const fs = require('fs');
const path = require('path');

// Load the Amplify configuration from the outputs file
const amplifyConfig = JSON.parse(fs.readFileSync('./amplify_outputs.json', 'utf8'));

// Configure Amplify
Amplify.configure(amplifyConfig);

async function testPhotoUpload() {
  try {
    // Sign in (you'll need to replace these with valid credentials)
    console.log('Signing in...');
    const username = process.env.TEST_USERNAME || 'test@example.com';
    const password = process.env.TEST_PASSWORD || 'YourPassword123!';
    
    await signIn({ username, password });
    console.log('Sign in successful');
    
    // Get user attributes
    const userAttributes = await fetchUserAttributes();
    console.log('User attributes:', userAttributes);
    
    // Generate client
    const client = generateClient();
    
    // Create a test image file (or you could use an existing one)
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    const fileContent = fs.readFileSync(testImagePath);
    
    // Generate a unique key for the file
    const key = `photos/test/${Date.now()}.jpg`;
    
    console.log('Uploading file to S3...');
    // Upload file to S3
    await uploadData({
      path: key,
      data: fileContent,
      options: {
        accessLevel: 'guest',
        onProgress: (progress) => {
          console.log(`Upload progress: ${progress.loaded}/${progress.total}`);
        },
      },
    });
    console.log('File uploaded successfully');
    
    // Create image dimensions
    const width = 800;
    const height = 600;
    
    console.log('Saving photo metadata to database...');
    // Save photo metadata to database
    const result = await client.models.Photo.create({
      title: 'Test Photo',
      description: 'This is a test photo uploaded via API',
      s3Key: key,
      width,
      height,
      isPublic: true,
      owner: userAttributes.sub,
    });
    
    console.log('Photo metadata saved successfully:', result);
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Error during test:', error);
  }
}

testPhotoUpload();
