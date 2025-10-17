import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxJsonSchema,
} from "rxdb";

export const checklistItemSchemaLiteral = {
  title: "checklist item schema",
  version: 0,
  description: "describes a single checklist item",
  type: "object",
  primaryKey: "id",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    checklistId: {
      type: "string",
    },
    title: {
      type: "string",
    },
    userId: {
      type: "string",
    },
    status: {
      type: "string",
      enum: ["not_started", "in_progress", "blocked", "final_check", "done"],
    },
    statusMessage: {
      type: "string",
      description: "Optional message when resolving status",
    },
    updatedAt: {
      type: "number",
      minimum: 0,
      maximum: Number.MAX_SAFE_INTEGER,
      multipleOf: 1,
    },
  },
  required: ["id", "checklistId", "userId", "title", "status", "updatedAt"],
} as const;

const schemaTyped = toTypedRxJsonSchema(checklistItemSchemaLiteral);

export type ChecklistItemSchemaType = typeof schemaTyped;

export type ChecklistItemDocType =
  ExtractDocumentTypeFromTypedRxJsonSchema<ChecklistItemSchemaType>;

export const checklistItemSchema: RxJsonSchema<ChecklistItemDocType> =
  schemaTyped;
