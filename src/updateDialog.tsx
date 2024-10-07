import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import useUpdateDialog from "@/hooks/useUpdateDialog";
import { relaunch } from "@tauri-apps/plugin-process";

function UpdateDialog() {
  const { open, setOpen, update } = useUpdateDialog();
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} defaultOpen={open} onOpenChange={setOpen}>
      <AlertDialogContent className="z-[1000] ">
        <AlertDialogHeader>
          <AlertDialogTitle>Update</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-2">
            {update && `Update to ${update.version} is available!`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("donate.dialog.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              setOpen(false);
              if (!update) return;
              await update.downloadAndInstall();
              await relaunch();
            }}
          >
            Update
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UpdateDialog;
