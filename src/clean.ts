import { readFile } from "node:fs/promises";
import { createUTApi } from "./shared";
import { Command } from "commander";
import { z } from "zod";
import { exit } from "node:process";

const manifestSchema = z.array(
  z.object({
    key: z.string(),
  })
);

export function loadCleanCommand(program: Command) {
  program
    .command("clean")
    .description("Deletes every file")
    .option("--confirm", "Go through with the deletion")
    .option("-k, --keep-manifest <path>", "Keep files recorded in the manifest")
    .action(async (options: { confirm?: boolean; keepManifest?: string }) => {
      const utapi = createUTApi();
      const deleteKeys: string[] = [];
      const keepKeys = new Set<string>();
      if (options.keepManifest) {
        const manifest = await readManifest(options.keepManifest);
        manifest.forEach(({ key }) => keepKeys.add(key));
      }

      const limit = 500;
      let hasMore = true;
      let offset = 0;
      while (hasMore) {
        const result = await utapi.listFiles({ offset, limit });
        result.files.forEach(({ key }) => {
          if (!keepKeys.has(key)) deleteKeys.push(key);
        });

        hasMore = result.hasMore;
        offset += limit;
      }

      console.log(`Found ${deleteKeys.length} files to delete`);
      if (options.confirm) {
        const { deletedCount } = await utapi.deleteFiles(deleteKeys);
        console.log(`Deleted ${deletedCount} files\n`);
      } else {
        console.log("Run with --confirm to go through with the deletion");
      }
    });
}

export async function readManifest(path: string) {
  try {
    const content = await readFile(path);
    const data = JSON.parse(content.toString());
    const manifest = manifestSchema.parse(data);
    return manifest;
  } catch (_) {
    console.error(`${JSON.stringify(path)} is not a valid JSON manifest`);
    exit(1);
  }
}
