
import { cn } from "../../lib/utils";


export function Container({ className, ...props }) {
  return (
    <div className={cn("container mx-auto px-4 md:px-6", className)} {...props} />
  );
}
