import { Database, getDatabase as getGlobalDatabase } from "firebase/database";

/**
 * instance of database
 */
let database: Database | null;

/**
 * get database instance
 */
export const getDatabase = (): Database => {
  return database || getGlobalDatabase();
};

/**
 * set database instance
 */
export const setDatabase = (db: Database): void => {
  database = db;
};
