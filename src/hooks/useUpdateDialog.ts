import { useEffect, useState } from "react";
import { check, Update } from "@tauri-apps/plugin-updater";



const useUpdateDialog = () => {
  async function checkForAppUpdates() {
    const update = await check();

    if (update?.available) {
      setSupportDialogOpen(true)
      setUpdate(update)
    }

  }
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [update, setUpdate] = useState<null | Update>(null)

  useEffect(() => {
    checkForAppUpdates()

  }, [])


  return { open: supportDialogOpen, setOpen: setSupportDialogOpen, update };
}

export default useUpdateDialog;