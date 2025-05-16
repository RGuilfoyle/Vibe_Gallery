import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'photo-gallery-storage-bucket',
  access: (allow) => ({
    // Public photos can be read by anyone
    'photos/public/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
    // Private photos can only be accessed by authenticated users
    'photos/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      // Owner-based access control
      allow.authenticated.if((auth, resource) => {
        // Extract user ID from the path (photos/userId/*)
        const pathParts = resource.split('/');
        return pathParts.length >= 2 && pathParts[1] === auth.userId;
      }).to(['read', 'write', 'delete'])
    ],
  }),
  // Configure lifecycle rules for cost optimization
  lifecycle: {
    rules: [
      {
        // Move infrequently accessed objects to cheaper storage after 90 days
        expiration: { days: 365 * 2 }, // Delete objects after 2 years
        transitions: [
          {
            storageClass: 'INTELLIGENT_TIERING',
            days: 90
          }
        ]
      }
    ]
  }
});
