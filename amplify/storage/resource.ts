import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'photo-gallery-storage-bucket',
  access: (allow) => ({
    'photos/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
  })
});
