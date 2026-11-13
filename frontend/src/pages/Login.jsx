
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token, setToken, navigate, backendUrl } =
    useContext(ShopContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!backendUrl) {
      toast.error('Backend URL is not configured.');
      return;
    }

    setIsSubmitting(true);

    try {
      const isSignUp = currentState === 'Sign Up';

      const endpoint = isSignUp
        ? '/api/user/register'
        : '/api/user/login';

      const payload = isSignUp
        ? { name: name.trim(), email: email.trim(), password }
        : { email: email.trim(), password };

      const response = await axios.post(
        `${backendUrl}${endpoint}`,
        payload
      );

      if (!response.data.success) {
        toast.error(response.data.message || 'Authentication failed.');
        return;
      }

      const receivedToken = response.data.token;

      if (!receivedToken) {
        toast.error('Authentication token was not returned.');
        return;
      }

      const user = response.data.user || response.data.existingUser;

      // Save the authenticated user's details.
      const resolvedName = isSignUp
        ? name.trim()
        : user?.name || user?.username || '';

      const resolvedEmail = user?.email || email.trim();

      localStorage.setItem('token', receivedToken);

      if (resolvedName) {
        localStorage.setItem('userName', resolvedName);
      } else {
        localStorage.removeItem('userName');
      }

      localStorage.setItem('userEmail', resolvedEmail);

      setToken(receivedToken);

      toast.success(
        isSignUp ? 'Account created successfully' : 'Login successful'
      );
    } catch (error) {
      console.error('COFIA authentication error:', error);

      toast.error(
        error.response?.data?.message ||
        'Unable to connect. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === 'Sign Up' && (
        <input
          onChange={(event) => setName(event.target.value)}
          value={name}
          type="text"
          autoComplete="name"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required
        />
      )}

      <input
        onChange={(event) => setEmail(event.target.value)}
        value={email}
        type="email"
        autoComplete="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />

      <input
        onChange={(event) => setPassword(event.target.value)}
        value={password}
        type="password"
        autoComplete={
          currentState === 'Sign Up' ? 'new-password' : 'current-password'
        }
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot Your Password?</p>

        {currentState === 'Login' ? (
          <p
            onClick={() => setCurrentState('Sign Up')}
            className="cursor-pointer"
          >
            Create Account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState('Login')}
            className="cursor-pointer"
          >
            Login Here
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white font-light px-8 py-2 mt-4 disabled:opacity-60"
      >
        {isSubmitting
          ? 'Please wait...'
          : currentState === 'Login'
            ? 'Sign In'
            : 'Sign Up'}
      </button>
    </form>
  );
};

export default Login;
