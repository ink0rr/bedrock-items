import { decodeBase64 } from "jsr:@std/encoding/base64";

export function decodeBase64Image(base64: string): Uint8Array {
  return decodeBase64(base64.split(",")[1]);
}
