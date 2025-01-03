import React from "react";
import { cva } from "tailwind-variants";

const buttonStyles = cva(
  "inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors rounded focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        outline: "border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      },
      size: {
        sm: "text-sm px-3 py-1",
        md: "text-base px-4 py-2",
        lg: "text-lg px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const Button = ({ children, variant, size, ...props }) => {
  return (
    <button className={buttonStyles({ variant, size })} {...props}>
      {children}
    </button>
  );
};

export { Button };
