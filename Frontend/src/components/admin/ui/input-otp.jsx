import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";
import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn("flex items-center gap-2", containerClassName)}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
));

const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));

const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
  const { slots } = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border text-sm",
        isActive && "ring-2 ring-ring",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && <div className="absolute h-4 w-px bg-foreground" />}
    </div>
  );
});

const InputOTPSeparator = React.forwardRef((props, ref) => (
  <div ref={ref} {...props}>
    <Dot />
  </div>
));

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
