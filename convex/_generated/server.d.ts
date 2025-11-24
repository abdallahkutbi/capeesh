/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated server utilities.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 *
 * @module
 */

import type {
  ActionBuilder,
  HttpActionBuilder,
  MutationBuilder,
  QueryBuilder,
  GenericQueryCtx,
  GenericMutationCtx,
  GenericActionCtx,
  GenericHttpActionCtx,
  GenericDatabaseReader,
  GenericDatabaseWriter,
} from "convex/server";
import type { DataModel } from "./dataModel";
import type { Api } from "./api";

/**
 * Define a query in this Convex app's API.
 *
 * @public
 */
export declare const query: QueryBuilder<DataModel, "public">;

/**
 * Define a mutation in this Convex app's API.
 *
 * @public
 */
export declare const mutation: MutationBuilder<DataModel, "public">;

/**
 * Define an action in this Convex app's API.
 *
 * @public
 */
export declare const action: ActionBuilder<DataModel, "public">;

/**
 * Define an HTTP action.
 *
 * @public
 */
export declare const httpAction: HttpActionBuilder;

/**
 * A set of services for use in Convex query and mutation functions.
 *
 * @public
 */
export type QueryCtx = GenericQueryCtx<DataModel>;

/**
 * A set of services for use in Convex mutation functions.
 *
 * @public
 */
export type MutationCtx = GenericMutationCtx<DataModel>;

/**
 * A set of services for use in Convex action functions.
 *
 * @public
 */
export type ActionCtx = GenericActionCtx<DataModel>;

/**
 * A set of services for use in Convex HTTP action functions.
 *
 * @public
 */
export type HttpActionCtx = GenericHttpActionCtx<DataModel>;

/**
 * An interface to read from the database.
 *
 * @public
 */
export type DatabaseReader = GenericDatabaseReader<DataModel>;

/**
 * An interface to write to the database.
 *
 * @public
 */
export type DatabaseWriter = GenericDatabaseWriter<DataModel>;

/* prettier-ignore-end */

