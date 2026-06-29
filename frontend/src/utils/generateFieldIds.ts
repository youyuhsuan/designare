/**
 * Custom hook that generates a unique ID with a required prefix
 * @param key - Required prefix for the generated ID (string or array of strings)
 * @returns A stable, unique ID string or array of ID strings
 */

export interface FieldIds {
  [key: string]: string;
}

const generateFieldIds = (keys: readonly string[]): FieldIds => {
  return keys.reduce((acc, key) => {
    acc[key] = `${key}-${crypto.randomUUID()}`;
    return acc;
  }, {} as FieldIds);
};

export default generateFieldIds;
