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
  },
  required: ["id", "taskId", "userId"],
} as const;

const schemaTyped = toTypedRxJsonSchema(checklistSchemaLiteral);

export type ChecklistSchemaType = typeof schemaTyped;

export type ChecklistDocType =
  ExtractDocumentTypeFromTypedRxJsonSchema<ChecklistSchemaType>;

export const checklistSchema: RxJsonSchema<ChecklistDocType> = schemaTyped;
