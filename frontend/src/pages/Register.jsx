import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useForm } from '../hooks/useForm.js';
import { getErrorMessage } from '../utils/getErrorMessage.js';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Alert from '../components/ui/Alert.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const { values, errors, setErrors, handleChange } = useForm({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = 'Name is required';
    if (!values.username.trim()) next.username = 'Username is required';
    else if (!/^[a-z0-9_]+$/.test(values.username))
      next.username = 'Use lowercase letters, numbers, and underscores only';
    if (!values.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = 'Enter a valid email';
    if (!values.password || values.password.length < 6)
      next.password = 'Password must be at least 6 characters';
    if (values.password !== values.confirmPassword)
      next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');

    try {
      await register({
        name: values.name.trim(),
        username: values.username.trim().toLowerCase(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(
        getErrorMessage(
          err,
          'Registration failed. Email or username may already be in use.'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join DevConnect and start collaborating"
    >
      {apiError && (
        <div className="mb-4">
          <Alert>{apiError}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-4 !p-6">
        <Input
          label="Full name"
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Jane Doe"
        />
        <Input
          label="Username"
          id="username"
          name="username"
          value={values.username}
          onChange={handleChange}
          error={errors.username}
          placeholder="janedev"
        />
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
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
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Min. 6 characters"
        />
        <Input
          label="Confirm password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />
        <Button type="submit" className="w-full" loading={loading}>
          Sign up
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
