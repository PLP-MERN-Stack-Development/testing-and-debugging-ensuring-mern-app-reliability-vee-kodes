import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  // Base classes
  let baseClasses = 'rounded font-medium focus:outline-none focus:ring ';

  // Variant classes
  let variantClass = '';
  if (disabled) {
    variantClass = 'bg-gray-300 text-gray-600 cursor-not-allowed';
  } else if (variant === 'primary') {
    variantClass = 'bg-blue-500 hover:bg-blue-600 text-white';
  } else if (variant === 'secondary') {
    variantClass = 'bg-gray-500 hover:bg-gray-600 text-white';
  } else if (variant === 'danger') {
    variantClass = 'bg-red-500 hover:bg-red-600 text-white';
  }

  // Size classes
  let sizeClass = '';
  if (size === 'sm') sizeClass = 'px-3 py-1 text-sm';
  if (size === 'md') sizeClass = 'px-4 py-2 text-base';
  if (size === 'lg') sizeClass = 'px-5 py-3 text-lg';

  return (
    <button
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
