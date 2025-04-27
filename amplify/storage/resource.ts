import { defineStorage } from '@aws-amplify/backend';
import { a } from '@aws-amplify/backend';
import { aws_s3 as s3 } from 'aws-cdk-lib';

export const storage = defineStorage({
  name: 'photo-gallery-storage-bucket',
  access: (allow) => ({
    // Allow authenticated users to create, read, update, and delete their own content
    authenticated: allow.userOwned().to(['create', 'read', 'update', 'delete']),
    // Allow unauthenticated users to read public content
    public: allow.guest().to(['read']),
  }),
  // Add custom CDK configuration for the bucket
  customCdkProps: {
    bucketProps: {
      // Enable versioning for recovery purposes
      versioned: true,
      // Configure lifecycle rules for cost optimization
      lifecycleRules: [
        {
          // Transition objects to Infrequent Access after 30 days
          transitions: [
            {
              storageClass: s3.StorageClass.INFREQUENT_ACCESS,
              transitionAfter: 120,
            },
          ],
          // Expire noncurrent versions after 90 days
          noncurrentVersionExpiration: 90,
        },
      ],
      // Enable server-side encryption
      encryption: s3.BucketEncryption.S3_MANAGED,
      // Configure CORS to allow web access
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.POST,
            s3.HttpMethods.PUT,
            s3.HttpMethods.DELETE,
          ],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          maxAge: 3000,
        },
      ],
    },
  },
});
