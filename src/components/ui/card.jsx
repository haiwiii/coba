import React from 'react';

export const Card = ({ className = '', children, ...props }) => (
  <div
    className={`rounded-2xl border bg-white shadow-sm overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ className = '', children, ...props }) => (
  <div className={`px-4 py-3 border-b ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className = '', children, ...props }) => (
  <h3 className={`text-sm font-medium text-gray-900 ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className = '', children, ...props }) => (
  <p className={`text-xs text-gray-500 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className = '', children, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className = '', children, ...props }) => (
  <div className={`px-4 py-3 border-t ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
