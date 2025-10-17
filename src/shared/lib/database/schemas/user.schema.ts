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
  primaryKey: "name",
  properties: {
    id: {
      type: "string",
    },
    name: {
      type: "string",
      maxLength: 100,
    },
    updatedAt: {
      type: "number",
      minimum: 0,
      maximum: Number.MAX_SAFE_INTEGER,
      multipleOf: 1,
    },
  },
  required: ["name", "id", "updatedAt"],
} as const;

const schemaTyped = toTypedRxJsonSchema(userSchemaLiteral);

export type UserSchemaType = typeof schemaTyped;

export type UserDocType =
  ExtractDocumentTypeFromTypedRxJsonSchema<UserSchemaType>;

export const userSchema: RxJsonSchema<UserDocType> = schemaTyped;
