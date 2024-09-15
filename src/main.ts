#!/usr/bin/env node
import { loadUploadCommand } from "./upload";
import { loadDeleteCommand } from "./delete";
import { loadCleanCommand } from "./clean";
import { loadListCommand } from "./list";
import { program } from "commander";

program.version("0.0.0");

loadUploadCommand(program);
loadListCommand(program);
loadDeleteCommand(program);
loadCleanCommand(program);

program.parse(process.argv);
