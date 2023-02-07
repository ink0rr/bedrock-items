export async function readJson<T>(path: string): Promise<T> {
  const data = await Deno.readTextFile(path);
  return JSON.parse(data);
}
