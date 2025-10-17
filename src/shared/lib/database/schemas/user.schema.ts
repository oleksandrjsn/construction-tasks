import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxJsonSchema,
} from "rxdb";

export const userSchemaLiteral = {
  title: "user schema",
  version: 0,
  description: "describes a user",
  type: "object",
  primaryKey: "id",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    name: {
      type: "string",
    },
  },
  required: ["name", "id"],
} as const;

const schemaTyped = toTypedRxJsonSchema(userSchemaLiteral);

export type UserSchemaType = typeof schemaTyped;

export type UserDocType =
  ExtractDocumentTypeFromTypedRxJsonSchema<UserSchemaType>;

export const userSchema: RxJsonSchema<UserDocType> = schemaTyped;
