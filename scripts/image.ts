import { decode } from "https://deno.land/std@0.176.0/encoding/base64.ts";

export function decodeBase64Image(base64: string): Uint8Array {
  return decode(base64.split(",")[1]);
}
