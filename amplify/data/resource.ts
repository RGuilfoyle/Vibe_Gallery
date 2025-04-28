import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
    
  Photo: a
    .model({
      title: a.string(),
      description: a.string(),  // Optional by default
      s3Key: a.string(),
      width: a.integer(),
      height: a.integer(),
      isPublic: a.boolean().default(false),
      owner: a.string(),
      thumbnailKey: a.string(), // S3 key for the thumbnail (optional by default)
      thumbnailWidth: a.integer(),
      thumbnailHeight: a.integer(),
    })
    .authorization((allow) => [
      // Allow authenticated users to create and read photos
      allow.authenticated().to(['create', 'read']),
      // Allow owners to update and delete their photos
      allow.owner().to(['update', 'delete']),
      // Allow public access to read photos
      allow.publicApiKey().to(['read']),
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
