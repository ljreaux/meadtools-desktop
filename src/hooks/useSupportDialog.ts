import { useEffect, useState } from "react";

const useSupportDialog = () => {
  const [supportDialogOpen, setSupportDialogOpen] = useState(
    !!JSON.parse(localStorage.getItem("supportDialogOpen") || "true")
  );
  useEffect(() => {
    localStorage.setItem("supportDialogOpen", supportDialogOpen.toString());
  }, [supportDialogOpen]);
  return { open: supportDialogOpen, setOpen: setSupportDialogOpen };
}

export default useSupportDialog;