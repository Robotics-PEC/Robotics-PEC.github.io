import { FormConfig } from "./types";

/**
 * Normalizes database-stored form configuration to the format required by DynamicForm.
 * This acts as a bridge, allowing the database schema to evolve independently
 * of the UI component's expected structure.
 */
export function normalizeFormConfig(dbConfig: any): FormConfig {
    // Currently, DB and UI schemas are identical.
    // If they diverge, transformation logic goes here.
    return dbConfig as FormConfig;
}
