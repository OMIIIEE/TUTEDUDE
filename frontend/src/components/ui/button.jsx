import React from "react";

const Button = ({ children, variant = "default", size = "md", ...props }) => {
  // Define different styles based on variant and size
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors rounded focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  const sizeStyles = {
    sm: "text-sm px-3 py-1",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  };

  // Combine base styles with selected variant and size styles
  const buttonClass = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`;

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export { Button };
