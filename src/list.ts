import { Command } from "commander";
import { createUTApi, safeParseInt } from "./shared";

export function loadListCommand(program: Command) {
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
}
