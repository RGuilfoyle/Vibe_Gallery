import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { thumbnailGenerator } from './function/resource';

// Define the backend with all resources
export const backend = defineBackend({
  auth,
  data,
  storage,
  thumbnailGenerator,
});
