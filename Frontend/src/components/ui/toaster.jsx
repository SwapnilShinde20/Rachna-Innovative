import * as React from "react";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <ToastViewport key={id} {...props}>
          {title && <div className="font-semibold">{title}</div>}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
          {action}
        </ToastViewport>
      ))}
    </ToastProvider>
  );
}

export { Toaster };
