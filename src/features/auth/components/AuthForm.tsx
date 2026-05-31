'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth.types';
import { getRedirectPath } from '../utils/redirect';

type AuthMode = 'login' | 'register';

export default function AuthForm() {
  const router = useRouter();
  const { login, register, isLoading } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user' satisfies UserRole
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      let loggedInUser;

      if (mode === 'login') {
        loggedInUser = await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        if (!formData.name) {
          setError('Nama harus diisi');
          setIsSubmitting(false);
          return;
        }

        loggedInUser = await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: formData.role,
        });
      }

      router.replace(getRedirectPath(loggedInUser.role));
      setIsSubmitting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F7F7FD]">
      <div className="bg-white rounded-[30px] border border-[#E0DEF7] p-10 w-full max-w-[400px]">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-3 px-4 rounded-[20px] font-semibold transition-all ${
              mode === 'login'
                ? 'bg-[#0D903A] text-white'
                : 'bg-[#F7F7FD] text-[#000929]'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 py-3 px-4 rounded-[20px] font-semibold transition-all ${
              mode === 'register'
                ? 'bg-[#0D903A] text-white'
                : 'bg-[#F7F7FD] text-[#000929]'
            }`}
          >
            Daftar
          </button>
        </div>

        {/* Form Title */}
        <h2 className="font-bold text-[28px] leading-[48px] text-[#000929] mb-6">
          {mode === 'login' ? 'Masuk ke Akun' : 'Buat Akun Baru'}
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-[#FF2D2D] text-white p-4 rounded-[20px] mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Input (hanya untuk register) */}
          {mode === 'register' && (
            <div>
              <label className="text-sm font-semibold text-[#000929] block mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama lengkap"
                className="w-full px-4 py-3 rounded-[20px] border border-[#E0DEF7] focus:outline-none focus:ring-2 focus:ring-[#0D903A] placeholder:text-[#000929] placeholder:font-normal"
                required={mode === 'register'}
              />
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="text-sm font-semibold text-[#000929] block mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Masukkan email"
              className="w-full px-4 py-3 rounded-[20px] border border-[#E0DEF7] focus:outline-none focus:ring-2 focus:ring-[#0D903A] placeholder:text-[#000929] placeholder:font-normal"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-sm font-semibold text-[#000929] block mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Masukkan password"
              className="w-full px-4 py-3 rounded-[20px] border border-[#E0DEF7] focus:outline-none focus:ring-2 focus:ring-[#0D903A] placeholder:text-[#000929] placeholder:font-normal"
              required
            />
          </div>

          {/* Role Select (hanya untuk register) */}
          {mode === 'register' && (
            <div>
              <label className="text-sm font-semibold text-[#000929] block mb-2">
                Pilih Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-[20px] border border-[#E0DEF7] focus:outline-none focus:ring-2 focus:ring-[#0D903A] text-[#000929] appearance-none bg-white cursor-pointer"
              >
                <option value="user">Customer</option>
                <option value="office_provider">Office Provider</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="bg-[#0D903A] text-white font-bold py-3 px-4 rounded-[20px] mt-4 hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || isSubmitting ? 'Loading...' : mode === 'login' ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        {/* Test Credentials Info */}
        {/* {mode === 'login' && (
          <div className="mt-6 p-4 bg-[#F7F7FD] rounded-[20px] text-sm">
            <p className="font-semibold text-[#000929] mb-2">📝 Test Credentials:</p>
            <div className="text-[#000929] text-xs space-y-1">
              <p><strong>Admin:</strong> admin@example.com / admin123</p>
              <p><strong>Provider:</strong> provider@example.com / provider123</p>
              <p><strong>Customer:</strong> customer@example.com / customer123</p>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}