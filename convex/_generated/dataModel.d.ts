/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated data model types.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 *
 * @module
 */

import type { DataModelFromSchemaDefinition } from "convex/server";
import type { Document, Id } from "./_generated/dataModel";
import schema from "../schema";

/**
 * The names of all of your Convex tables.
 * @public
 */
export type TableNames = "books" | "quizzes" | "readingSessions" | "userProgress";

/**
 * A type describing your Convex data model.
 *
 * @public
 */
export type DataModel = DataModelFromSchemaDefinition<typeof schema>;

/**
 * A type for a document in your Convex tables.
 *
 * @public
 */
export type Doc<TableName extends TableNames> = Document<DataModel, TableName>;

/**
 * A type for a document ID in your Convex tables.
 *
 * @public
 */
export type Id<TableName extends TableNames> = Id<DataModel, TableName>;

/* prettier-ignore-end */

