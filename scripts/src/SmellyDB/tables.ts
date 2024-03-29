import { Database } from "./Database";

/**
 * All the Database tables that are created
 */
export const TABLES = {
  test: new Database<string, any>("test"),
  example: new Database<string, any>("example"),
  CC: new Database<string, any>("CC")
};
