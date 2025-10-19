import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxJsonSchema,
} from "rxdb";

export const checklistSchemaLiteral = {
  title: "checklist schema",
  version: 0,
  description: "describes a checklist item",
  type: "object",
  primaryKey: "id",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    taskId: {
      type: "string",
    },
    userId: {
      type: "string",
    },
    title: {
      type: "string",
    },
    createdAt: {
      type: "number",
      minimum: 0,
      maximum: Number.MAX_SAFE_INTEGER,
      multipleOf: 1,
    },
    updatedAt: {
      type: "number",
      minimum: 0,
      maximum: Number.MAX_SAFE_INTEGER,
      multipleOf: 1,
    },
  },
  required: ["id", "taskId", "userId", "createdAt", "updatedAt"],
} as const;

const schemaTyped = toTypedRxJsonSchema(checklistSchemaLiteral);

export type ChecklistSchemaType = typeof schemaTyped;

export type ChecklistDocType =
  ExtractDocumentTypeFromTypedRxJsonSchema<ChecklistSchemaType>;

export const checklistSchema: RxJsonSchema<ChecklistDocType> = schemaTyped;
