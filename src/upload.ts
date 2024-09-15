import { readFile, writeFile } from "node:fs/promises";
import { UTFile } from "uploadthing/server";
import { createUTApi } from "./shared";
import { Command } from "commander";
import { UploadedFileData } from "uploadthing/types";

export function loadUploadCommand(program: Command) {
  program
    .command("upload")
    .description("Upload a list of files")
    .option("-m, --manifest <path>", "A JSON file to write upload details to")
    .argument("<filepaths...>", "A list of files to upload")
    .action(function (filepaths: string[], options: { manifest?: string }) {
      const utapi = createUTApi();
      const manifest: UploadedFileData[] = [];
      let i = 0;

      filepaths.forEach(async (filepath) => {
        const file = await readUTFile(filepath);
        const result = await utapi.uploadFiles(file);

        if (result.data) {
          logUploadedFileData(result.data, ++i, filepaths.length);
          manifest.push(result.data);
        } else {
          logFailedFileUpload(filepath, ++i, filepaths.length);
        }

        if (options.manifest) {
          await writeFile(options.manifest, JSON.stringify(manifest, null, 2));
        }
      });
    });
}

async function readUTFile(path: string) {
  const buffer = await readFile(path);
  return new UTFile([new Blob([buffer])], path);
}

function logUploadedFileData(
  uploadedFileData: UploadedFileData,
  i: number,
  n: number
) {
  console.log(
    `Successfully uploaded ${JSON.stringify(uploadedFileData.name)} [${i}/${n}]`
  );
  console.log(`Key: ${uploadedFileData.key}`);
  console.log(`URL: ${uploadedFileData.url}`);
  console.log(`App URL: ${uploadedFileData.appUrl}`);
  console.log(`MIME Type: ${uploadedFileData.type}\n`);
}

function logFailedFileUpload(filepath: string, i: number, n: number) {
  console.error(`Could not upload ${JSON.stringify(filepath)} [${i}/${n}]`);
}
