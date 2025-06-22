/**
 * Type of primitive json value
 */
export type JSONPrimitive = string | number | boolean | null;

/**
 * Type of json array
 */
export type JSONArray = JSONObject[];

/**
 * Type of json object
 */
export type JSONObject = { [key:string]: JSONPrimitive | JSONObject | JSONArray };
