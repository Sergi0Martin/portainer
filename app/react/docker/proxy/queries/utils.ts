/**
/* The Docker API often returns a list of JSON object.
/* This handler wrap the JSON objects in an array.
/* Used by the API in: Image push, Image create, Events query.
 */
export function jsonObjectsToArrayHandler<T>(data: string) {
  if (!data) {
    return [];
  }
  const str = `[${data.replace(/\n/g, ' ').replace(/\}\s*\{/g, '}, {')}]`;
  return JSON.parse(str) as T[];
}
