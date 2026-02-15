import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { apiPost } from '../utils/api.ts';
import type { ApiResponse } from '../utils/api.ts';
import { useAuth } from '../utils/AuthContext.tsx';
import { TextInput, Button } from '../elements/index.ts';

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginResponse {
  email: string;
  name: string;
  token: string;
  type: string;
  userId: number;
}

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const loginMutation = useMutation({
    mutationFn: (values: LoginFormValues) =>
      apiPost<LoginResponse>('/api/user/login', values),
    onSuccess: (response: ApiResponse<LoginResponse>) => {
      const { token, email, name, userId } = response.data;
      setAuth(token, { email, name, userId });
      navigate('/');
    },
  });

  const handleSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            This is log in
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow">
              <div className="space-y-4">
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={loginMutation.isPending}
                disabled={isSubmitting || loginMutation.isPending}
              >
                Sign in
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
