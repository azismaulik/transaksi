import React from "react";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  loadingText?: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
}

const SubmitButton = ({
  children,
  disabled,
  loadingText,
  className,
  variant,
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      className={cn(className)}
      disabled={pending || disabled}
      variant={variant || "default"}
      size="sm"
      type="submit">
      {pending ? (
        <p>
          <span className="loader size-5 mr-2"></span>
          {loadingText || "Loading..."}
        </p>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
