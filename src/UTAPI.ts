import { UTApi } from "uploadthing/server";

export class UTAPI extends UTApi {
  constructor() {
    if (!("UPLOADTHING_TOKEN" in process.env)) {
      console.error(
        "UPLOADTHING_TOKEN is not present in your environment. Please add it before using this tool, by running `export UPLOADTHING_TOKEN=<...>`"
      );
    }
    super();
  }
}
