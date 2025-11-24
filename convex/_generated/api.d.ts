/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 *
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as books from "../books";
import type * as quizzes from "../quizzes";
import type * as readingSessions from "../readingSessions";
import type * as schema from "../schema";
import type * as userProgress from "../userProgress";

/**
 * A utility for referencing Convex functions in your app.
 *
 * @public
 */
const fullApi = {
  books: books,
  quizzes: quizzes,
  readingSessions: readingSessions,
  schema: schema,
  userProgress: userProgress,
} as const;

export type Api = ApiFromModules<typeof fullApi>;

export const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, any>
> = fullApi;

/* prettier-ignore-end */

