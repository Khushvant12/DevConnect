import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useForm } from '../hooks/useForm.js';
import { getErrorMessage } from '../utils/getErrorMessage.js';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Alert from '../components/ui/Alert.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const { values, errors, setErrors, handleChange } = useForm({
    email: '',
    password: '',
  });
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!values.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = 'Enter a valid email';
    if (!values.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');

    try {
      await login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(
        getErrorMessage(err, 'Login failed. Check your email and password.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to connect with developers on DevConnect"
    >
      {apiError && (
        <div className="mb-4">
          <Alert>{apiError}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-4 !p-6">
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="••••••••"
        />
        <Button type="submit" className="w-full" loading={loading}>
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
