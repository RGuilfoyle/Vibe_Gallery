import { defineFunction } from '@aws-amplify/backend';

// Define the thumbnail generator function with a simplified configuration
export const thumbnailGenerator = defineFunction({
  name: 'thumbnailGenerator',
  entry: 'amplify/function/thumbnail-generator/index.js',
});
