/**
 * Utility functions for handling BigInt serialization
 */

/**
 * Recursively converts BigInt values to strings for JSON serialization
 * @param obj - Object containing BigInt values
 * @returns Object with BigInt values converted to strings
 */
export function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle BigInt
  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  // Handle Arrays
  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt);
  }

  // Handle Objects
  if (typeof obj === 'object') {
    const serialized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        serialized[key] = serializeBigInt(obj[key]);
      }
    }
    return serialized;
  }

  // Return primitive values as-is
  return obj;
}

/**
 * Custom JSON.stringify replacer function for BigInt
 * @param key - Object key
 * @param value - Object value
 * @returns Serialized value
 */
export function bigIntReplacer(key: string, value: any): any {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

/**
 * Safely stringify an object that may contain BigInt values
 * @param obj - Object to stringify
 * @param pretty - Whether to format with indentation
 * @returns JSON string
 */
export function stringifyWithBigInt(obj: any, pretty: boolean = false): string {
  return JSON.stringify(serializeBigInt(obj), null, pretty ? 2 : 0);
}

/**
 * Parse JSON string and convert numeric strings back to BigInt where appropriate
 * @param jsonString - JSON string to parse
 * @param bigIntKeys - Array of keys that should be converted to BigInt
 * @returns Parsed object with BigInt values restored
 */
export function parseWithBigInt(jsonString: string, bigIntKeys: string[] = []): any {
  const obj = JSON.parse(jsonString);

  function restoreBigInt(value: any): any {
    if (value === null || value === undefined) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(restoreBigInt);
    }

    if (typeof value === 'object') {
      const restored: any = {};
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          // Convert to BigInt if key is in bigIntKeys
          if (bigIntKeys.includes(key) && typeof value[key] === 'string') {
            try {
              restored[key] = BigInt(value[key]);
            } catch {
              restored[key] = value[key];
            }
          } else {
            restored[key] = restoreBigInt(value[key]);
          }
        }
      }
      return restored;
    }

    return value;
  }

  return restoreBigInt(obj);
}

/**
 * Example usage:
 *
 * const data = {
 *   amount: 1000n,
 *   value: 500n,
 *   nested: {
 *     price: 42n
 *   }
 * };
 *
 * // Serialize
 * const json = stringifyWithBigInt(data);
 * console.log(json); // {"amount":"1000","value":"500","nested":{"price":"42"}}
 *
 * // Parse back
 * const restored = parseWithBigInt(json, ['amount', 'value', 'price']);
 * console.log(restored.amount); // 1000n (BigInt)
 */
