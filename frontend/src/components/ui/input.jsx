import React from "react";

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`block w-full px-4 py-2 text-sm border rounded focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
