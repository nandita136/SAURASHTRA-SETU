import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Phone, Mail, ArrowRight } from 'lucide-react';
import { apiCall } from '../utils/api';
import { t } from '../utils/language';

const OTPVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, phone, userType, userId } = location.state || {};

  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [displayOtps, setDisplayOtps] = useState<{ phoneOtp: string; emailOtp: string } | null>(null);

  useEffect(() => {
    // Send OTPs automatically when component mounts
    sendOTPs();
    
    // Timer for resend button
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const sendOTPs = async () => {
    try {
      const response = await apiCall('/auth/send-verification-otp', {
        method: 'POST',
        body: JSON.stringify({ email, phone, userId })
      });
      
      // Show OTPs for testing
      if (response.debug) {
        setDisplayOtps(response.debug);
      }
    } catch (error) {
      console.error('Error sending OTPs:', error);
    }
  };

  const handleVerifyPhone = async () => {
    if (phoneOtp.length !== 6) {
      alert('Please enter valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await apiCall('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          type: 'phone',
          otp: phoneOtp
        })
      });

      setPhoneVerified(true);
      alert(t('otpVerified'));
    } catch (error: any) {
      console.error('Error verifying phone OTP:', error);
      alert(error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (emailOtp.length !== 6) {
      alert('Please enter valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await apiCall('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          type: 'email',
          otp: emailOtp
        })
      });

      setEmailVerified(true);
      alert(t('otpVerified'));
    } catch (error: any) {
      console.error('Error verifying email OTP:', error);
      alert(error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!phoneVerified || !emailVerified) {
      alert('Please verify both phone and email');
      return;
    }

    // Navigate to appropriate dashboard
    if (userType === 'farmer') {
      navigate('/farmer/dashboard');
    } else {
      navigate('/company/dashboard');
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    await sendOTPs();
    setResendTimer(60);
    alert('OTPs resent successfully');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Verify Your Contact Details
          </h1>
          <p className="text-gray-600 text-sm">
            We've sent OTPs to your phone and email
          </p>
        </div>

        {/* Display OTPs for Testing */}
        {displayOtps && (
          <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-800 mb-2 text-center">
              🔧 Testing Mode - OTPs Generated:
            </p>
            <div className="flex gap-4 justify-center">
              <div className="text-center">
                <p className="text-xs text-blue-600 mb-1">Phone OTP</p>
                <p className="text-2xl font-mono font-bold text-blue-800">{displayOtps.phoneOtp}</p>
                <button
                  onClick={() => setPhoneOtp(displayOtps.phoneOtp)}
                  className="mt-1 text-xs text-blue-600 hover:underline"
                >
                  Auto-fill
                </button>
              </div>
              <div className="text-center">
                <p className="text-xs text-blue-600 mb-1">Email OTP</p>
                <p className="text-2xl font-mono font-bold text-blue-800">{displayOtps.emailOtp}</p>
                <button
                  onClick={() => setEmailOtp(displayOtps.emailOtp)}
                  className="mt-1 text-xs text-blue-600 hover:underline"
                >
                  Auto-fill
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Phone Verification */}
          <div className="border-2 border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Phone Number</p>
                  <p className="text-sm text-gray-600">{phone}</p>
                </div>
              </div>
              {phoneVerified && (
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {!phoneVerified && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-center text-xl tracking-widest font-mono"
                />
                <button
                  onClick={handleVerifyPhone}
                  disabled={loading || phoneOtp.length !== 6}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  Verify Phone
                </button>
              </div>
            )}
          </div>

          {/* Email Verification */}
          <div className="border-2 border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Email Address</p>
                  <p className="text-sm text-gray-600">{email}</p>
                </div>
              </div>
              {emailVerified && (
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {!emailVerified && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-center text-xl tracking-widest font-mono"
                />
                <button
                  onClick={handleVerifyEmail}
                  disabled={loading || emailOtp.length !== 6}
                  className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition-all disabled:opacity-50"
                >
                  Verify Email
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Resend OTP */}
        <div className="text-center mt-6">
          <button
            onClick={handleResend}
            disabled={resendTimer > 0}
            className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
          </button>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!phoneVerified || !emailVerified}
          className="w-full mt-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Continue to Dashboard
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <p className="text-xs text-yellow-800 text-center">
            <strong>Note:</strong> Both phone and email verification are mandatory to continue
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;