import { createUTApi } from "./shared";
import { Command } from "commander";

export function loadDeleteCommand(program: Command) {
  program
    .command("delete")
    .description("Delete a list of files by key")
    .argument("<keys...>", "The list of file keys to delete")
    .action(async (keys: string[]) => {
      const utapi = createUTApi();
      let n = 0;
      keys.forEach(async (key) => {
        const result = await utapi.deleteFiles(key);
        if (result.success && result.deletedCount) {
          console.log(
            `Successfully deleted ${JSON.stringify(key)} [${++n}/${
              keys.length
            }]\n`
          );
        } else {
          console.error(
            `Failed to delete ${JSON.stringify(key)} [${++n}/${keys.length}]`
          );
        }
      });
    });
}
