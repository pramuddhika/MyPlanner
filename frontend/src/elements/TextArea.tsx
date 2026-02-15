import { Field, ErrorMessage } from 'formik';

interface TextAreaProps {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  textareaClassName?: string;
  errorClassName?: string;
}

const TextArea = ({
  label,
  name,
  placeholder,
  rows = 4,
  required = false,
  disabled = false,
  className = '',
  labelClassName = 'block text-sm font-medium text-gray-700 mb-1',
  textareaClassName = 'appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm resize-vertical',
  errorClassName = 'mt-1 text-sm text-red-600',
}: TextAreaProps) => {
  return (
    <div className={className}>
      <label htmlFor={name} className={labelClassName}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Field
        as="textarea"
        id={name}
        name={name}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={textareaClassName}
      />
      <ErrorMessage name={name} component="div" className={errorClassName} />
    </div>
  );
};

export default TextArea;
