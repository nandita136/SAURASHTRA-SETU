import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Phone, Mail, Upload, Lock, ArrowRight, Check, FileText } from 'lucide-react';
import { apiCall } from '../utils/api';

const CompanySignup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    gstNumber: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
    phoneOtp: '',
    emailOtp: '',
  });

  const [certificates, setCertificates] = useState<File[]>([]);
  const [otpSent, setOtpSent] = useState({ phone: false, email: false });
  const [otpVerified, setOtpVerified] = useState({ phone: false, email: false });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCertificates(Array.from(e.target.files));
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
      // Validate company details
      if (formData.companyName.length < 3) {
        alert('Please enter a valid company name');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Validate certificates
      if (certificates.length === 0) {
        alert('Please upload at least one verification certificate');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      try {
        // Submit company registration to backend
        const response = await apiCall('/auth/company/signup', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        
        console.log('Company registration successful:', response);
        
        // Navigate to OTP verification page
        navigate('/verify-otp', {
          state: {
            email: formData.email,
            phone: formData.phone,
            userType: 'company',
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/signup" className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-600 rounded-full mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">SS</span>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-2">
            Company Registration
          </h1>
          <p className="text-gray-600">
            Step {step} of 3
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 bg-white rounded-full p-1 shadow-md">
          <div className="flex gap-1">
            <div className={`h-2 rounded-full flex-1 transition-all ${step >= 1 ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
            <div className={`h-2 rounded-full flex-1 transition-all ${step >= 2 ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
            <div className={`h-2 rounded-full flex-1 transition-all ${step >= 3 ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Step 1: Company Info */}
            {step === 1 && (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Company Information</h2>
                
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Enter registered company name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all bg-gray-50 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      placeholder="Company Reg. No."
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      GST Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      placeholder="GST Number"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    placeholder="Name of authorized person"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    required
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all bg-gray-50 focus:bg-white"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Company Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Complete office address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all bg-gray-50 focus:bg-white"
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
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all bg-gray-50 focus:bg-white"
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
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </>
            )}

            {/* Step 2: Document Upload */}
            {step === 2 && (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Verification Documents</h2>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-2">
                    Upload Company Verification Certificates
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Registration Certificate, GST Certificate, Trade License, etc.
                  </p>
                  <label className="inline-block cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <span className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors inline-block">
                      Choose Files
                    </span>
                  </label>
                </div>

                {certificates.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="font-medium text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Uploaded Files ({certificates.length})
                    </p>
                    {certificates.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm text-gray-700 flex-1">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> All documents will be verified by our team. You will receive confirmation within 24-48 hours.
                  </p>
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
                        className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all bg-gray-50 focus:bg-white disabled:bg-gray-100"
                      />
                      {!otpVerified.phone && (
                        <button
                          type="button"
                          onClick={() => sendOtp('phone')}
                          disabled={otpSent.phone || formData.phone.length !== 10}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                          {otpSent.phone ? 'Sent' : 'Send OTP'}
                        </button>
                      )}
                      {otpVerified.phone && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg">
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
                          className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all bg-gray-50 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => verifyOtp('phone')}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
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
                        placeholder="Enter company email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={otpVerified.email}
                        className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all bg-gray-50 focus:bg-white disabled:bg-gray-100"
                      />
                      {!otpVerified.email && (
                        <button
                          type="button"
                          onClick={() => sendOtp('email')}
                          disabled={otpSent.email || !formData.email.includes('@')}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                          {otpSent.email ? 'Sent' : 'Send OTP'}
                        </button>
                      )}
                      {otpVerified.email && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg">
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
                          className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all bg-gray-50 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => verifyOtp('email')}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
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
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 flex items-center justify-center gap-2"
              >
                {step === 3 ? 'Complete Registration' : 'Continue'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/" className="text-emerald-600 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanySignup;