import React, { useState } from "react";
import { ConfirmationDialog } from "../confirmation-dialog";

export interface ConfirmationConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
}

export interface WithConfirmationProps {
  onConfirm?: () => void | Promise<void>;
  confirmationConfig?: ConfirmationConfig;
  onClick?: (event: React.MouseEvent) => void;
}

export function withConfirmation<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  const ComponentWithConfirmation = React.forwardRef<
    HTMLElement,
    T & WithConfirmationProps
  >((props, ref) => {
    const { onConfirm, confirmationConfig, onClick, ...restProps } = props;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = (event: React.MouseEvent) => {
      if (onConfirm && confirmationConfig) {
        setIsDialogOpen(true);
      } else if (onClick) {
        onClick(event);
      }
    };

    const handleConfirm = async () => {
      if (!onConfirm) return;

      try {
        setIsLoading(true);
        await onConfirm();
        setIsDialogOpen(false);
      } catch (error) {
        console.error("Confirmation action failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleCancel = () => {
      setIsDialogOpen(false);
    };

    const handleClose = () => {
      if (!isLoading) {
        setIsDialogOpen(false);
      }
    };

    return (
      <>
        <WrappedComponent
          {...(restProps as T)}
          ref={ref}
          onClick={handleClick}
        />
        {confirmationConfig && (
          <ConfirmationDialog
            isOpen={isDialogOpen}
            onClose={handleClose}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            title={confirmationConfig.title}
            message={confirmationConfig.message}
            confirmText={confirmationConfig.confirmText}
            cancelText={confirmationConfig.cancelText}
            confirmVariant={confirmationConfig.confirmVariant}
            isLoading={isLoading}
          />
        )}
      </>
    );
  });

  ComponentWithConfirmation.displayName = `withConfirmation(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ComponentWithConfirmation;
}
