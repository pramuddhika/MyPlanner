import { Field, ErrorMessage } from 'formik';

interface TextInputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

const TextInput = ({
  label,
  name,
  type = 'text',
  placeholder,
  autoComplete,
  required = false,
  disabled = false,
  className = '',
  labelClassName = 'block text-sm font-medium text-gray-700 mb-1',
  inputClassName = 'appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm',
  errorClassName = 'mt-1 text-sm text-red-600',
}: TextInputProps) => {
  return (
    <div className={className}>
      <label htmlFor={name} className={labelClassName}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className={inputClassName}
      />
      <ErrorMessage name={name} component="div" className={errorClassName} />
    </div>
  );
};

export default TextInput;
