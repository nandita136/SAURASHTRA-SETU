import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Building2, ArrowRight } from 'lucide-react';

const SignupChoice: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full mb-6 shadow-xl">
            <span className="text-white text-3xl font-bold">SS</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-3">
            Join Saurashtra Setu
          </h1>
          <p className="text-gray-600 text-lg">
            Choose your account type to get started
          </p>
        </div>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Farmer Card */}
          <div
            onClick={() => navigate('/signup/farmer')}
            className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-2 border-2 border-transparent hover:border-green-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300">
                <User className="w-10 h-10 text-green-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                I'm a Farmer
              </h2>
              <p className="text-gray-600 mb-6">
                Sell your groundnut produce directly to buyers with AI-powered quality certification
              </p>
              <ul className="text-left text-sm text-gray-600 space-y-2 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Upload groundnut photos for AI quality analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Set your selling price and quantity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Receive and accept buyer offers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Direct contact with verified buyers</span>
                </li>
              </ul>
              <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-4 transition-all">
                Sign up as Farmer
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Company Card */}
          <div
            onClick={() => navigate('/signup/company')}
            className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-2 border-2 border-transparent hover:border-emerald-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors duration-300">
                <Building2 className="w-10 h-10 text-emerald-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                I'm a Buyer/Company
              </h2>
              <p className="text-gray-600 mb-6">
                Source quality groundnuts directly from farmers with verified certifications
              </p>
              <ul className="text-left text-sm text-gray-600 space-y-2 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span>Browse AI-certified groundnut listings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span>View quality metrics and moisture levels</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span>Make offers for partial or full quantities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span>Direct contact with verified farmers</span>
                </li>
              </ul>
              <div className="flex items-center gap-2 text-emerald-600 font-semibold group-hover:gap-4 transition-all">
                Sign up as Company
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Back to Login */}
        <p className="text-center text-gray-600 mt-8">
          Already have an account?{' '}
          <Link to="/" className="text-green-600 font-semibold hover:text-green-700 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupChoice;
