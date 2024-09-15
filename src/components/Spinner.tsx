import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const Spinner = ({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "small" | "default";
}) => {
  return (
    <Loader2
      className={cn(
        "text-primary/60 animate-spin",
        className,
        variant === "small" ? "h-8 w-8" : "h-16 w-16"
      )}
    />
  );
};

export default Spinner;
