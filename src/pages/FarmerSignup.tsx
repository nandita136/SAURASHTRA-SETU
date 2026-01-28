import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, Mail, MapPin, CreditCard, Lock, ArrowRight, Check } from 'lucide-react';
import { apiCall } from '../utils/api';

const FarmerSignup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    aadharNumber: '',
    name: '',
    phone: '',
    email: '',
    pincode: '',
    region: '',
    address: '',
    password: '',
    confirmPassword: '',
    phoneOtp: '',
    emailOtp: '',
  });

  const [otpSent, setOtpSent] = useState({ phone: false, email: false });
  const [otpVerified, setOtpVerified] = useState({ phone: false, email: false });

  const saurashtraPincodes = ['360001', '360002', '360003', '360004', '360005', '360311', '360410', '361001', '362001', '363001'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-fill region based on pincode
    if (name === 'pincode' && saurashtraPincodes.includes(value)) {
      setFormData(prev => ({ ...prev, region: 'Saurashtra' }));
    }
  };

  const sendOtp = async (type: 'phone' | 'email') => {
    // TODO: Implement actual OTP sending
    console.log(`Sending OTP to ${type}:`, formData[type]);
    setOtpSent(prev => ({ ...prev, [type]: true }));
  };

  const verifyOtp = async (type: 'phone' | 'email') => {
    // TODO: Implement actual OTP verification
    console.log(`Verifying OTP for ${type}:`, formData[`${type}Otp`]);
    setOtpVerified(prev => ({ ...prev, [type]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate Aadhar (basic check)
      if (formData.aadharNumber.length !== 12) {
        alert('Please enter a valid 12-digit Aadhar number');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Validate pincode
      if (!saurashtraPincodes.includes(formData.pincode)) {
        alert('Only Saurashtra region pincodes are allowed');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      try {
        // Submit farmer registration to backend
        const registrationData = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          aadhar: formData.aadharNumber,  // Map aadharNumber to aadhar
          phone: formData.phone,
          pincode: formData.pincode,
          region: formData.region,
          address: formData.address
        };
        
        const response = await apiCall('/auth/farmer/signup', {
          method: 'POST',
          body: JSON.stringify(registrationData)
        });
        
        console.log('Farmer registration successful:', response);
        
        // Navigate to OTP verification page
        navigate('/verify-otp', {
          state: {
            email: formData.email,
            phone: formData.phone,
            userType: 'farmer',
            userId: response.userId
          }
        });
      } catch (error: any) {
        console.error('Registration error:', error);
        alert(error.message || 'Registration failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/signup" className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">SS</span>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-2">
            Farmer Registration
          </h1>
          <p className="text-gray-600">
            Step {step} of 3
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 bg-white rounded-full p-1 shadow-md">
          <div className="flex gap-1">
            <div className={`h-2 rounded-full flex-1 transition-all ${step >= 1 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
            <div className={`h-2 rounded-full flex-1 transition-all ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
            <div className={`h-2 rounded-full flex-1 transition-all ${step >= 3 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Step 1: Aadhar & Basic Info */}
            {step === 1 && (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h2>
                
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    Aadhar Number
                  </label>
                  <input
                    type="text"
                    name="aadharNumber"
                    placeholder="Enter 12-digit Aadhar number"
                    value={formData.aadharNumber}
                    onChange={handleInputChange}
                    maxLength={12}
                    required
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all bg-gray-50 focus:bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">This will be used for verification purposes only</p>
                </div>

                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all bg-gray-50 focus:bg-white"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all bg-gray-50 focus:bg-white"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Location Details</h2>
                
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Pincode (Saurashtra Region Only)
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Enter 6-digit pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    maxLength={6}
                    required
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all bg-gray-50 focus:bg-white"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Region
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    readOnly
                    placeholder="Auto-filled based on pincode"
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 bg-gray-100 text-gray-600"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Complete Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Village/Town, District"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </>
            )}

            {/* Step 3: Contact Verification */}
            {step === 3 && (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Verification</h2>
                
                <div className="space-y-4">
                  {/* Phone Verification */}
                  <div className="border-2 border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter 10-digit mobile number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength={10}
                        required
                        disabled={otpVerified.phone}
                        className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all bg-gray-50 focus:bg-white disabled:bg-gray-100"
                      />
                      {!otpVerified.phone && (
                        <button
                          type="button"
                          onClick={() => sendOtp('phone')}
                          disabled={otpSent.phone || formData.phone.length !== 10}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                          {otpSent.phone ? 'Sent' : 'Send OTP'}
                        </button>
                      )}
                      {otpVerified.phone && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">Verified</span>
                        </div>
                      )}
                    </div>
                    
                    {otpSent.phone && !otpVerified.phone && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="phoneOtp"
                          placeholder="Enter 6-digit OTP"
                          value={formData.phoneOtp}
                          onChange={handleInputChange}
                          maxLength={6}
                          className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all bg-gray-50 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => verifyOtp('phone')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          Verify
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Email Verification */}
                  <div className="border-2 border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={otpVerified.email}
                        className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all bg-gray-50 focus:bg-white disabled:bg-gray-100"
                      />
                      {!otpVerified.email && (
                        <button
                          type="button"
                          onClick={() => sendOtp('email')}
                          disabled={otpSent.email || !formData.email.includes('@')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                          {otpSent.email ? 'Sent' : 'Send OTP'}
                        </button>
                      )}
                      {otpVerified.email && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">Verified</span>
                        </div>
                      )}
                    </div>
                    
                    {otpSent.email && !otpVerified.email && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="emailOtp"
                          placeholder="Enter 6-digit OTP"
                          value={formData.emailOtp}
                          onChange={handleInputChange}
                          maxLength={6}
                          className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all bg-gray-50 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => verifyOtp('email')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          Verify
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 flex items-center justify-center gap-2"
              >
                {step === 3 ? 'Complete Registration' : 'Continue'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/" className="text-green-600 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmerSignup;