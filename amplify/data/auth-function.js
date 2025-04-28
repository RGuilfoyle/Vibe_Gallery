/**
 * Lambda function for API authorization
 * This replaces the deprecated IAM authorization provider
 */
exports.handler = async (event) => {
  console.log('Auth event:', JSON.stringify(event, null, 2));
  
  // In a real implementation, you would validate tokens, check permissions, etc.
  // For now, we'll just authorize all requests
  return {
    isAuthorized: true,
    resolverContext: {
      // Add any context you want to pass to your resolvers
      owner: event.identity ? event.identity.username : 'anonymous',
    },
  };
};
