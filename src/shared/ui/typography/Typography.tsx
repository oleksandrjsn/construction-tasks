import React from "react";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body1"
  | "body2"
  | "caption"
  | "subtitle1"
  | "subtitle2";

export type TypographyColor =
  | "primary"
  | "secondary"
  | "muted"
  | "error"
  | "warning"
  | "success"
  | "inherit";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  color?: TypographyColor;
  align?: "left" | "center" | "right";
  component?: React.ElementType;
  children: React.ReactNode;
}

const variantMapping: Record<TypographyVariant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body1: "p",
  body2: "p",
  caption: "span",
  subtitle1: "p",
  subtitle2: "p",
};

const variantClasses: Record<TypographyVariant, string> = {
  h1: "text-4xl font-bold leading-tight",
  h2: "text-3xl font-bold leading-tight",
  h3: "text-2xl font-semibold leading-tight",
  h4: "text-xl font-semibold leading-tight",
  h5: "text-lg font-medium leading-tight",
  h6: "text-base font-medium leading-tight",
  body1: "text-base leading-relaxed",
  body2: "text-sm leading-relaxed",
  caption: "text-xs leading-normal",
  subtitle1: "text-lg leading-relaxed",
  subtitle2: "text-base leading-relaxed",
};

const colorClasses: Record<TypographyColor, string> = {
  primary: "text-gray-900",
  secondary: "text-gray-700",
  muted: "text-gray-600",
  error: "text-red-600",
  warning: "text-yellow-600",
  success: "text-green-600",
  inherit: "",
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export const Typography = ({
  variant = "body1",
  color = "primary",
  align = "left",
  component,
  children,
  className = "",
  ...props
}: TypographyProps) => {
  const Component = component || variantMapping[variant];

  const classes = [
    variantClasses[variant],
    colorClasses[color],
    alignClasses[align],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};
