/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreatePhoto = /* GraphQL */ `subscription OnCreatePhoto($filter: ModelSubscriptionPhotoFilterInput) {
  onCreatePhoto(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePhotoSubscriptionVariables,
  APITypes.OnCreatePhotoSubscription
>;
export const onDeletePhoto = /* GraphQL */ `subscription OnDeletePhoto($filter: ModelSubscriptionPhotoFilterInput) {
  onDeletePhoto(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePhotoSubscriptionVariables,
  APITypes.OnDeletePhotoSubscription
>;
export const onUpdatePhoto = /* GraphQL */ `subscription OnUpdatePhoto($filter: ModelSubscriptionPhotoFilterInput) {
  onUpdatePhoto(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePhotoSubscriptionVariables,
  APITypes.OnUpdatePhotoSubscription
>;
