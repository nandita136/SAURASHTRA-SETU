import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, User, Building2, Shield } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { t } from '../utils/language';
import { apiCall } from '../utils/api';
import { setAuthToken, setCurrentUser } from '../utils/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'farmer' | 'company' | 'admin'>('farmer');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, userType })
      });
      
      setAuthToken(response.token);
      setCurrentUser(response.user);
      
      // Navigate based on user type
      if (userType === 'farmer') {
        navigate('/farmer/dashboard');
      } else if (userType === 'company') {
        navigate('/company/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-green-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* Language Toggle - Top Right */}
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      {/* Login Card */}
      <div className="relative bg-white/95 backdrop-blur-lg w-full max-w-md rounded-2xl shadow-2xl px-8 py-10 m-4">
        
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">SS</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            {t('appName')}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {t('tagline')}
          </p>
        </div>

        {/* User Type Selection */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setUserType('farmer')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all text-sm ${
              userType === 'farmer'
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <User className="w-4 h-4" />
            {t('farmer')}
          </button>
          <button
            type="button"
            onClick={() => setUserType('company')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all text-sm ${
              userType === 'company'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            {t('buyer')}
          </button>
          <button
            type="button"
            onClick={() => setUserType('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all text-sm ${
              userType === 'admin'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('email')} / Phone
            </label>
            <input
              type="text"
              placeholder="Enter email or phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('password')}
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="flex justify-end">
            <Link 
              to="/forgot-password" 
              className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline transition-colors duration-200"
            >
              {t('forgotPassword')}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn className="w-5 h-5" />
            {loading ? 'Logging in...' : `${t('login')} as ${userType === 'farmer' ? t('farmer') : userType === 'company' ? t('buyer') : 'Admin'}`}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 mt-8">
          {t('dontHaveAccount')}{' '}
          <Link to="/signup" className="text-green-600 font-semibold hover:text-green-700 hover:underline transition-colors duration-200">
            {t('signup')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;