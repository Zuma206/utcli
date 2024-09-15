import { readFile, writeFile } from "node:fs/promises";
import { UTFile } from "uploadthing/server";
import { createUTApi } from "./shared";
import { Command } from "commander";

export function loadUploadCommand(program: Command) {
  program
    .command("upload")
    .description("Upload a list of files")
    .option("-m, --manifest <path>", "A JSON file to write upload details to")
    .argument("<filepaths...>", "A list of files to upload")
    .action(function (filepaths: string[], options: { manifest?: string }) {
      const utapi = createUTApi();
      const manifest: unknown[] = [];

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
          manifest.push(result.data);
        } else {
          console.error(
            `Could not upload ${JSON.stringify(filepath)} [${++n}/${
              filepath.length
            }]`
          );
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
