import { Database } from "firebase/database";

/**
 * instance of database
 */
let database: Database;

/**
 * get database instance
 */
export const getDatabase = (): Database => {
  return database;
};

/**
 * set database instance
 */
export const setDatabase = (db: Database): void => {
  database = db;
};
