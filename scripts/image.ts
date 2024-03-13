import { decodeBase64 } from "https://deno.land/std@0.219.0/encoding/base64.ts";

export function decodeBase64Image(base64: string): Uint8Array {
  return decodeBase64(base64.split(",")[1]);
}
