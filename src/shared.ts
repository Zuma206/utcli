import { UTApi } from "uploadthing/server";
import { exit } from "node:process";

export function createUTApi() {
  if (!("UPLOADTHING_TOKEN" in process.env)) {
    console.error(
      "Please export an UPLOADTHING_TOKEN before using this command"
    );
    exit(1);
  }
  return new UTApi();
}

export function safeParseInt(text: string) {
  try {
    const result = parseInt(text);
    if (isNaN(result)) throw new Error("Got NaN");
    return result;
  } catch (err) {
    console.error(`${JSON.stringify(text)} is not a valid number`);
    exit(1);
  }
}
