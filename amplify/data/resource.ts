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
      description: a.string().optional(),
      s3Key: a.string(),
      width: a.integer(),
      height: a.integer(),
      isPublic: a.boolean().default(false),
      owner: a.string(),
    })
    .authorization((allow) => [
      // Allow authenticated users to create and read photos
      allow.authenticated().to(['create', 'read']),
      // Allow owners to update and delete their photos
      allow.owner().to(['update', 'delete']),
      // Allow public read access to photos marked as public
      allow.public().to(['read']).where(
        { isPublic: { eq: true } }
      ),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
    // Enable IAM authorization for S3 integration
    iamAuthorizationMode: {
      authenticatedUserRole: {
        permissions: ['data:Read', 'data:Create', 'data:Update', 'data:Delete'],
      },
    },
    // Enable Cognito user pools for user authentication
    userPoolAuthorizationMode: {
      userPoolName: 'vibeGalleryUserPool',
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
