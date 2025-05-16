import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Photo: a
    .model({
      title: a.string().required(),
      description: a.string(),  // Optional by default
      s3Key: a.string().required(),
      width: a.integer().required(),
      height: a.integer().required(),
      isPublic: a.boolean().default(false),
      owner: a.string().required(),
      thumbnailKey: a.string(), // S3 key for the thumbnail (optional by default)
      thumbnailWidth: a.integer(),
      thumbnailHeight: a.integer(),
      tags: a.array().items(a.string()), // Optional array of tags
      likes: a.integer().default(0), // Track number of likes
      views: a.integer().default(0), // Track number of views
      uploadedAt: a.datetime().default(a.now()), // Automatically set upload timestamp
      updatedAt: a.datetime().default(a.now()), // Automatically updated
    })
    .authorization((allow) => [
      // Allow authenticated users to create and read photos
      allow.authenticated().to(['create', 'read']),
      // Allow owners to update and delete their photos
      allow.owner().to(['update', 'delete']),
      // Allow public access to read photos marked as public
      allow.publicApiKey().if(
        (_, photo) => photo.isPublic === true
      ).to(['read']),
    ]),
  
  // Add Album model for organizing photos
  Album: a
    .model({
      name: a.string().required(),
      description: a.string(),
      owner: a.string().required(),
      isPublic: a.boolean().default(false),
      coverPhotoId: a.string(), // Reference to a photo ID for the album cover
      photos: a.hasMany('Photo'),
      createdAt: a.datetime().default(a.now()),
      updatedAt: a.datetime().default(a.now()),
    })
    .authorization((allow) => [
      allow.authenticated().to(['create', 'read']),
      allow.owner().to(['update', 'delete']),
      allow.publicApiKey().if(
        (_, album) => album.isPublic === true
      ).to(['read']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for allow.publicApiKey() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
