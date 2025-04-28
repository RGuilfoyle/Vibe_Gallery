/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getPhoto = /* GraphQL */ `query GetPhoto($id: ID!) {
  getPhoto(id: $id) {
    createdAt
    description
    height
    id
    isPublic
    owner
    s3Key
    thumbnailHeight
    thumbnailKey
    thumbnailWidth
    title
    updatedAt
    width
    __typename
  }
}
` as GeneratedQuery<APITypes.GetPhotoQueryVariables, APITypes.GetPhotoQuery>;
export const listPhotos = /* GraphQL */ `query ListPhotos(
  $filter: ModelPhotoFilterInput
  $limit: Int
  $nextToken: String
) {
  listPhotos(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      description
      height
      id
      isPublic
      owner
      s3Key
      thumbnailHeight
      thumbnailKey
      thumbnailWidth
      title
      updatedAt
      width
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPhotosQueryVariables,
  APITypes.ListPhotosQuery
>;
