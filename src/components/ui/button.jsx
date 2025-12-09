import React from 'react';

const base =
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  default: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 shadow-md hover:shadow-lg',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
  outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300',
  link: 'bg-transparent text-purple-600 hover:text-purple-700 hover:underline',
};

const sizes = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-2.5 py-1.5',
  md: 'px-4 py-2',
  lg: 'px-6 py-3',
};

export const Button = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const v = variants[variant] ?? variants.default;
  const s = sizes[size] ?? sizes.md;

  return (
    <button className={`${base} ${v} ${s} ${className}`} {...props}>
      <span className="flex items-center justify-center gap-2">
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </span>
    </button>
  );
};

export default Button;
