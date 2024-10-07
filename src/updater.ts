import { check } from "@tauri-apps/plugin-updater";
import { ask } from "@tauri-apps/plugin-dialog";
import { relaunch } from "@tauri-apps/plugin-process";

export async function checkForAppUpdates() {
  const update = await check();
  console.log(update);
  if (update?.available) {
    const yes = await ask(
      `
Update to ${update.version} is available!
        `,
      {
        title: "Update Now!",
        kind: "info",
        okLabel: "Update",
        cancelLabel: "Cancel",
      }
    );
    console.log(yes);
    if (yes) {
      await update.downloadAndInstall();
      await relaunch();
    }
  }
}