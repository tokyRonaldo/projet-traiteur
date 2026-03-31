import React, { ElementType } from "react";
import { Slot } from "@radix-ui/react-slot";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "icon";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      asChild = false,
      children,
      icon,
      className = "",
      ...props
    },
    ref
  ) => {
    const Comp: ElementType = asChild ? Slot : "button";

    const content = asChild ? (
      React.Children.only(children)
    ) : (
      <>
        {icon && <span className={variant === "icon" ? "text-xl" : ""}>{icon}</span>}
        {children}
      </>
    );

    const baseStyles =
      "font-bold transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50";

    const variants: Record<ButtonVariant, string> = {
      primary: "bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20",
      secondary: "bg-secondary text-white hover:brightness-110",
      outline:
        "border border-primary/30 hover:bg-primary/5 hover:border-primary/40 text-primary dark:text-slate-100",
      ghost: "hover:bg-primary/10 text-primary",
      icon: "bg-primary/5 hover:bg-primary/10 text-slate-700 dark:text-slate-300",
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "px-4 py-2 text-sm rounded-xl",
      md: "px-5 py-3 text-sm rounded-xl",
      lg: "px-8 py-4 text-base rounded-xl",
      icon: "h-10 w-10 rounded-xl",
    };

    const isIconOnly = variant === "icon" || (!children && !!icon);

    return (
      <Comp
        ref={ref}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${isIconOnly ? "p-0" : ""}
          ${className}
        `.trim()}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };