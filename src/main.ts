#!/usr/bin/env node
import { UTApi, UTFile } from "uploadthing/server";
import { readFile } from "fs/promises";
import { program } from "commander";
import { exit } from "process";

program.version("0.0.0");

program
  .command("upload")
  .description("Upload a list of files")
  .argument("<filepaths...>", "A list of files to upload")
  .action(function (filepaths: string[]) {
    const utapi = createUTApi();
    filepaths.forEach(async (filepath) => {
      const file = await readUTFile(filepath);
      const result = await utapi.uploadFiles(file);
      let n = 0;
      if (result.data) {
        console.log(
          `Successfully uploaded ${JSON.stringify(filepath)} [${++n}/${
            filepaths.length
          }]`
        );
        console.log(`Key: ${result.data.key}`);
        console.log(`URL: ${result.data.url}`);
        console.log(`App URL: ${result.data.appUrl}`);
        console.log(`MIME Type: ${result.data.type}\n`);
      } else {
        console.error(
          `Could not upload ${JSON.stringify(filepath)} [${++n}/${
            filepath.length
          }]`
        );
      }
    });
  });

program
  .command("list")
  .description("Get a list of all files in utfs")
  .option(
    "-l, --limit [count]",
    "The maximum amount of files to list",
    safeParseInt
  )
  .option("-o, --offset [count]", "The number of files to skip", safeParseInt)
  .action(async (options: { limit?: number; offset?: number }) => {
    const utapi = createUTApi();
    const { files, hasMore } = await utapi.listFiles(options);
    files.forEach((file, index) => {
      console.log(`Name: ${JSON.stringify(file.name)}`);
      console.log(`Key: ${file.key}`);
      console.log(`Offset: ${index + (options.offset ?? 0)}\n`);
    });
    hasMore && console.log("More available...\n");
  });

program.parse(process.argv);

function createUTApi() {
  if (!("UPLOADTHING_TOKEN" in process.env)) {
    console.error(
      "Please export an UPLOADTHING_TOKEN before using this command"
    );
    exit(1);
  }
  return new UTApi();
}

async function readUTFile(path: string) {
  const buffer = await readFile(path);
  return new UTFile([new Blob([buffer])], path);
}

function safeParseInt(text: string) {
  try {
    const result = parseInt(text);
    if (isNaN(result)) throw new Error("Got NaN");
    return result;
  } catch (err) {
    console.error(`${JSON.stringify(text)} is not a valid number`);
    exit(1);
  }
}
