import { decode } from "std/encoding/base64.ts";

export function decodeBase64Image(base64: string): Uint8Array {
  return decode(base64.split(",")[1]);
}
