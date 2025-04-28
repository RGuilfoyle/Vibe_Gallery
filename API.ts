/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Photo = {
  __typename: "Photo",
  createdAt: string,
  description?: string | null,
  height?: number | null,
  id: string,
  isPublic?: boolean | null,
  owner?: string | null,
  s3Key?: string | null,
  thumbnailHeight?: number | null,
  thumbnailKey?: string | null,
  thumbnailWidth?: number | null,
  title?: string | null,
  updatedAt: string,
  width?: number | null,
};

export type ModelPhotoFilterInput = {
  and?: Array< ModelPhotoFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  height?: ModelIntInput | null,
  id?: ModelIDInput | null,
  isPublic?: ModelBooleanInput | null,
  not?: ModelPhotoFilterInput | null,
  or?: Array< ModelPhotoFilterInput | null > | null,
  owner?: ModelStringInput | null,
  s3Key?: ModelStringInput | null,
  thumbnailHeight?: ModelIntInput | null,
  thumbnailKey?: ModelStringInput | null,
  thumbnailWidth?: ModelIntInput | null,
  title?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  width?: ModelIntInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelPhotoConnection = {
  __typename: "ModelPhotoConnection",
  items:  Array<Photo | null >,
  nextToken?: string | null,
};

export type ModelPhotoConditionInput = {
  and?: Array< ModelPhotoConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  height?: ModelIntInput | null,
  isPublic?: ModelBooleanInput | null,
  not?: ModelPhotoConditionInput | null,
  or?: Array< ModelPhotoConditionInput | null > | null,
  owner?: ModelStringInput | null,
  s3Key?: ModelStringInput | null,
  thumbnailHeight?: ModelIntInput | null,
  thumbnailKey?: ModelStringInput | null,
  thumbnailWidth?: ModelIntInput | null,
  title?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  width?: ModelIntInput | null,
};

export type CreatePhotoInput = {
  description?: string | null,
  height?: number | null,
  id?: string | null,
  isPublic?: boolean | null,
  owner?: string | null,
  s3Key?: string | null,
  thumbnailHeight?: number | null,
  thumbnailKey?: string | null,
  thumbnailWidth?: number | null,
  title?: string | null,
  width?: number | null,
};

export type DeletePhotoInput = {
  id: string,
};

export type UpdatePhotoInput = {
  description?: string | null,
  height?: number | null,
  id: string,
  isPublic?: boolean | null,
  owner?: string | null,
  s3Key?: string | null,
  thumbnailHeight?: number | null,
  thumbnailKey?: string | null,
  thumbnailWidth?: number | null,
  title?: string | null,
  width?: number | null,
};

export type ModelSubscriptionPhotoFilterInput = {
  and?: Array< ModelSubscriptionPhotoFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  height?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  isPublic?: ModelSubscriptionBooleanInput | null,
  or?: Array< ModelSubscriptionPhotoFilterInput | null > | null,
  owner?: ModelStringInput | null,
  s3Key?: ModelSubscriptionStringInput | null,
  thumbnailHeight?: ModelSubscriptionIntInput | null,
  thumbnailKey?: ModelSubscriptionStringInput | null,
  thumbnailWidth?: ModelSubscriptionIntInput | null,
  title?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  width?: ModelSubscriptionIntInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type GetPhotoQueryVariables = {
  id: string,
};

export type GetPhotoQuery = {
  getPhoto?:  {
    __typename: "Photo",
    createdAt: string,
    description?: string | null,
    height?: number | null,
    id: string,
    isPublic?: boolean | null,
    owner?: string | null,
    s3Key?: string | null,
    thumbnailHeight?: number | null,
    thumbnailKey?: string | null,
    thumbnailWidth?: number | null,
    title?: string | null,
    updatedAt: string,
    width?: number | null,
  } | null,
};

export type ListPhotosQueryVariables = {
  filter?: ModelPhotoFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPhotosQuery = {
  listPhotos?:  {
    __typename: "ModelPhotoConnection",
    items:  Array< {
      __typename: "Photo",
      createdAt: string,
      description?: string | null,
      height?: number | null,
      id: string,
      isPublic?: boolean | null,
      owner?: string | null,
      s3Key?: string | null,
      thumbnailHeight?: number | null,
      thumbnailKey?: string | null,
      thumbnailWidth?: number | null,
      title?: string | null,
      updatedAt: string,
      width?: number | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreatePhotoMutationVariables = {
  condition?: ModelPhotoConditionInput | null,
  input: CreatePhotoInput,
};

export type CreatePhotoMutation = {
  createPhoto?:  {
    __typename: "Photo",
    createdAt: string,
    description?: string | null,
    height?: number | null,
    id: string,
    isPublic?: boolean | null,
    owner?: string | null,
    s3Key?: string | null,
    thumbnailHeight?: number | null,
    thumbnailKey?: string | null,
    thumbnailWidth?: number | null,
    title?: string | null,
    updatedAt: string,
    width?: number | null,
  } | null,
};

export type DeletePhotoMutationVariables = {
  condition?: ModelPhotoConditionInput | null,
  input: DeletePhotoInput,
};

export type DeletePhotoMutation = {
  deletePhoto?:  {
    __typename: "Photo",
    createdAt: string,
    description?: string | null,
    height?: number | null,
    id: string,
    isPublic?: boolean | null,
    owner?: string | null,
    s3Key?: string | null,
    thumbnailHeight?: number | null,
    thumbnailKey?: string | null,
    thumbnailWidth?: number | null,
    title?: string | null,
    updatedAt: string,
    width?: number | null,
  } | null,
};

export type UpdatePhotoMutationVariables = {
  condition?: ModelPhotoConditionInput | null,
  input: UpdatePhotoInput,
};

export type UpdatePhotoMutation = {
  updatePhoto?:  {
    __typename: "Photo",
    createdAt: string,
    description?: string | null,
    height?: number | null,
    id: string,
    isPublic?: boolean | null,
    owner?: string | null,
    s3Key?: string | null,
    thumbnailHeight?: number | null,
    thumbnailKey?: string | null,
    thumbnailWidth?: number | null,
    title?: string | null,
    updatedAt: string,
    width?: number | null,
  } | null,
};

export type OnCreatePhotoSubscriptionVariables = {
  filter?: ModelSubscriptionPhotoFilterInput | null,
};

export type OnCreatePhotoSubscription = {
  onCreatePhoto?:  {
    __typename: "Photo",
    createdAt: string,
    description?: string | null,
    height?: number | null,
    id: string,
    isPublic?: boolean | null,
    owner?: string | null,
    s3Key?: string | null,
    thumbnailHeight?: number | null,
    thumbnailKey?: string | null,
    thumbnailWidth?: number | null,
    title?: string | null,
    updatedAt: string,
    width?: number | null,
  } | null,
};

export type OnDeletePhotoSubscriptionVariables = {
  filter?: ModelSubscriptionPhotoFilterInput | null,
};

export type OnDeletePhotoSubscription = {
  onDeletePhoto?:  {
    __typename: "Photo",
    createdAt: string,
    description?: string | null,
    height?: number | null,
    id: string,
    isPublic?: boolean | null,
    owner?: string | null,
    s3Key?: string | null,
    thumbnailHeight?: number | null,
    thumbnailKey?: string | null,
    thumbnailWidth?: number | null,
    title?: string | null,
    updatedAt: string,
    width?: number | null,
  } | null,
};

export type OnUpdatePhotoSubscriptionVariables = {
  filter?: ModelSubscriptionPhotoFilterInput | null,
};

export type OnUpdatePhotoSubscription = {
  onUpdatePhoto?:  {
    __typename: "Photo",
    createdAt: string,
    description?: string | null,
    height?: number | null,
    id: string,
    isPublic?: boolean | null,
    owner?: string | null,
    s3Key?: string | null,
    thumbnailHeight?: number | null,
    thumbnailKey?: string | null,
    thumbnailWidth?: number | null,
    title?: string | null,
    updatedAt: string,
    width?: number | null,
  } | null,
};
