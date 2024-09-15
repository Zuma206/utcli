#!/usr/bin/env node
import { UTApi, UTFile } from "uploadthing/server";
import { readFile } from "fs/promises";
import { program } from "commander";
import { exit } from "process";

program.version("0.0.0");

program
  .command("upload")
  .argument("<filepaths...>", "A list of files to upload")
  .action(function (filepaths: string[]) {
    const utapi = createUTApi();
    filepaths.forEach(async (filepath) => {
      const file = await readUTFile(filepath);
      const result = await utapi.uploadFiles(file);
      let n = 0;
      if (result.data) {
        console.log(
          `Successfully uploaded ${JSON.stringify(result.data.name)} [${++n}/${
            filepaths.length
          }]`
        );
        console.log(`Key: ${result.data.key}`);
        console.log(`URL: ${result.data.url}`);
        console.log(`App URL: ${result.data.appUrl}`);
        console.log(`MIME Type: ${result.data.type}\n`);
      } else {
      }
    });
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
