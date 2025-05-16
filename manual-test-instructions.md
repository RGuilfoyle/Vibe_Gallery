# Manual Testing Instructions for Photo Upload API

Since the Photo Upload API requires authentication and browser interaction, here's how to test it manually:

## Prerequisites
- The application is running locally at http://localhost:3000
- You have created an account or can sign up for one

## Testing Steps

### 1. Sign Up (if you don't have an account)
1. Open http://localhost:3000 in your browser
2. Click on "Create account" on the authentication screen
3. Fill in the required information:
   - Email
   - Password (must meet requirements: uppercase, lowercase, number, symbol, min 8 chars)
4. Complete the verification process by entering the code sent to your email

### 2. Sign In
1. Enter your email and password
2. Click "Sign in"

### 3. Test Photo Upload
1. Click on the "Upload Photo" tab in the navigation
2. Fill in the form:
   - Click "Select Photo" and choose an image file from your computer
   - Enter a title for the photo
   - Optionally add a description
   - Check "Make this photo public" if you want the photo to be publicly accessible
3. Click "Upload Photo"
4. Watch the progress bar to see the upload progress
5. After successful upload, you should be automatically redirected to the Gallery tab

### 4. Verify Upload Success
1. The newly uploaded photo should appear in the Gallery
2. If it doesn't appear immediately, try refreshing the page

### 5. Test API Directly (Optional)
You can also test the API directly using the AWS AppSync console:

1. Go to the AWS AppSync console: https://console.aws.amazon.com/appsync/
2. Select your API (the URL is in the amplify_outputs.json file)
3. Go to the Queries tab
4. Run a query to list photos:
   ```graphql
   query ListPhotos {
     listPhotos {
       items {
         id
         title
         description
         s3Key
         width
         height
         isPublic
         owner
         createdAt
       }
     }
   }
   ```

## Expected Results
- The photo should upload successfully
- You should see a progress indicator during upload
- After upload, the photo should appear in the gallery
- The photo metadata should be stored in the database
- The photo file should be stored in S3

## Troubleshooting
- If the upload fails, check the browser console for error messages
- Verify that your authentication is working correctly
- Check that the S3 bucket permissions are set correctly
- Ensure the GraphQL schema is properly deployed
