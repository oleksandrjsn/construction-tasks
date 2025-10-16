import {
  toTypedRxJsonSchema,
  type ExtractDocumentTypeFromTypedRxJsonSchema,
  type RxJsonSchema,
} from "rxdb";

export const taskSchemaLiteral = {
  title: "task schema",
  version: 0,
  description: "describes a task",
  type: "object",
  primaryKey: "id",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    userId: {
      type: "string",
    },
    title: {
      type: "string",
    },
    position: {
      type: "object",
      properties: {
        x: { type: "number" },
        y: { type: "number" },
      },
      required: ["x", "y"],
      default: { x: 0, y: 0 },
    },
  },
  required: ["userId", "title", "position"],
} as const;

const schemaTyped = toTypedRxJsonSchema(taskSchemaLiteral);

export type TaskSchemaType = typeof schemaTyped;

export type TaskDocType =
  ExtractDocumentTypeFromTypedRxJsonSchema<TaskSchemaType>;

export const taskSchema: RxJsonSchema<TaskDocType> = schemaTyped;
