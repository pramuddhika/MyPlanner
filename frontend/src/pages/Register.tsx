import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { apiPost } from '../utils/api.ts';
import { TextInput, Button } from '../elements/index.ts';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const Register = () => {
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: (values: Omit<RegisterFormValues, 'confirmPassword'>) =>
      apiPost('/api/user/register', values),
    onSuccess: () => {
      navigate('/login');
    },
  });

  const handleSubmit = (values: RegisterFormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            This is register page
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to existing account
            </Link>
          </p>
        </div>

        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow">
              <div className="space-y-4">
                <TextInput
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />

                <TextInput
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />

                <TextInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                />

                <TextInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={registerMutation.isPending}
                disabled={isSubmitting || registerMutation.isPending}
              >
                Sign up
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
