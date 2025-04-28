/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createPhoto = /* GraphQL */ `mutation CreatePhoto(
  $condition: ModelPhotoConditionInput
  $input: CreatePhotoInput!
) {
  createPhoto(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePhotoMutationVariables,
  APITypes.CreatePhotoMutation
>;
export const deletePhoto = /* GraphQL */ `mutation DeletePhoto(
  $condition: ModelPhotoConditionInput
  $input: DeletePhotoInput!
) {
  deletePhoto(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePhotoMutationVariables,
  APITypes.DeletePhotoMutation
>;
export const updatePhoto = /* GraphQL */ `mutation UpdatePhoto(
  $condition: ModelPhotoConditionInput
  $input: UpdatePhotoInput!
) {
  updatePhoto(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePhotoMutationVariables,
  APITypes.UpdatePhotoMutation
>;
