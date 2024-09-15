import { Command } from "commander";
import { createUTApi } from "./shared";

export function loadCleanCommand(program: Command) {
  program
    .command("clean")
    .description("Deletes every file")
    .option("--confirm", "Go through with the deletion")
    .action(async (options: { confirm?: boolean }) => {
      const utapi = createUTApi();
      const keys: string[] = [];

      const limit = 500;
      let hasMore = true;
      let offset = 0;
      while (hasMore) {
        const result = await utapi.listFiles({ offset, limit });
        result.files.forEach((file) => keys.push(file.key));

        hasMore = result.hasMore;
        offset += limit;
      }

      console.log(`Found ${keys.length} files to delete`);
      if (options.confirm) {
        const { deletedCount } = await utapi.deleteFiles(keys);
        console.log(`Deleted ${deletedCount} files\n`);
      } else {
        console.log("Run with --confirm to go through with the deletion");
      }
    });
}
