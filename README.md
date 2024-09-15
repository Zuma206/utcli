![Logo](https://raw.githubusercontent.com/Zuma206/utcli/main/utcli.png)<br/>
UTCLI - An unofficial uploadthing cli tool

## About

This project aims to broaden the uses for uploadthing, by exposing it's REST API through a cli tool. It can be used to upload, list, and delete files inside your uploadthing project. It's primary use case is for creating a rolling CDN, which you can read more about below.

## Commands

| Command | Options                            | Purpose                                                                                  | Example                                                                                                              |
| ------- | ---------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Upload  | `<files...> --manifest <path>`     | Uploads files to the project in parallel, optionally recording the uploads to a manifest | `npx utcli upload image.png image.jpeg --manifest manifest.json`                                                     |
| List    | `--offset <count> --limit <count>` | Lists all files currently in the project                                                 | `npx utcli list --offset 20 --limit 10`                                                                              |
| Delete  | `<keys...>`                        | Deletes all the files specified as keys                                                  | `npx utcli delete a0sDw0d2hE4eIgpIHPNbTjxrwPKzsCt9f5Y7J4yOW2XE1ac0 a0sDw0d2hE4em8aeirVWPf5d0MJIz67eyki9jEYp2XCFHqrB` |
| Clean   | `--confirm --keep-manifest <path>` | Deletes every file in the project, except those included in the keep-manifest            | `npx utcli clean --keep-manifest manifest.json --confirm`                                                            |

## Authentication

Running any commands that interface with the uploadthing API will fail if an `UPLOADTHING_TOKEN` isn't available in your environment. To make it available, run `export UPLOADTHING_TOKEN=<...>`, or add it to you application CI/CD.

## Rolling CDN Pattern

With UTCLI, you can easily setup what I call a 'rolling CDN'. As part of your application's build step, run `npx utcli upload <static files> --manifest manifest.json`. This uploads all of your static files to your uploadthing project. Your application can then link to them, or serve redirects to them, using the manifest file. Finally, to make the system 'rolling', we need to delete the static files from the last build. This can be done using `npx utcli clean --keep-manifest manifest.json --confirm`.
