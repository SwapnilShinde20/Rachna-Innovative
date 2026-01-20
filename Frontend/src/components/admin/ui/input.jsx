import * as React from "react";
import { cn } from "../../../lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-10 w-full rounded-md border px-3 py-2 text-sm",
      className
    )}
    {...props}
  />
));

export { Input };
