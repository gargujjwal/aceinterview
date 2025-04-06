/**
 * Generates a random ID string without using external libraries
 * @param length The length of the ID (default: 16)
 * @returns A random string ID
 */
export function generateRandomId(length: number = 16): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const timestamp = new Date().getTime().toString(36);

  let result = timestamp.slice(0, 4) + "-";

  for (let i = 0; i < length - 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}
