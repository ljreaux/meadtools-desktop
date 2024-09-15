import React from "react";
import { TableBody, TableCell } from "./table";
import Spinner from "./Spinner";

export default function LoadingTable({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: React.ReactNode;
}) {
  if (!isLoading) return <>{children}</>;

  return (
    <TableBody className="flex items-center">
      <TableCell className="flex items-center justify-center w-full">
        <Spinner />
      </TableCell>
    </TableBody>
  );
}
