'use client'
import React, { useState } from 'react';
import { Mail, Phone, Shield, Trash2, AlertCircle, CheckCircle, Send } from 'lucide-react';

const Home = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const api = process.env.NEXT_PUBLIC_API_BASE_URL;

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      showMessage('Please enter a valid phone number', 'error');
      return;
    }

    setLoading(true);
    try {
      // Replace with your API endpoint
      const response = await fetch(`${api}/user/check-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: phoneNumber }),
      });


      const data = await response.json();

      if (response.ok) {
        if (data.hasEmail) {
          setStep(2);
          showMessage('Account found! Please verify your identity.', 'success');
        } else {
          showMessage('Please add your email address in the app first, then try again.', 'error');
        }
      } else {
        showMessage(data.message || 'Account not found with this phone number.', 'error');
      }
    } catch (error) {
      showMessage('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerification = async () => {
    if (!email) {
      showMessage('Please enter your email address', 'error');
      return;
    }

    setLoading(true);
    try {
      // Replace with your API endpoint
      const response = await fetch(`${api}/user/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          mobile: phoneNumber,
          email: email 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(3);
        showMessage('Verification code sent to your email!', 'success');
      } else {
        showMessage(data.message || 'Email does not match our records.', 'error');
      }
    } catch (error) {
      showMessage('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndDelete = async () => {
    if (!verificationCode || verificationCode.length < 4) {
      showMessage('Please enter the verification code', 'error');
      return;
    }

    setLoading(true);
    try {
      // Replace with your API endpoint
      const response = await fetch(`${api}/user/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: phoneNumber,
          email: email,
          verificationCode: verificationCode
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(4);
        showMessage('Account deleted successfully!', 'success');
      } else {
        showMessage(data.message || 'Invalid verification code.', 'error');
      }
    } catch (error) {
      showMessage('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setPhoneNumber('');
    setEmail('');
    setVerificationCode('');
    setMessage('');
    setMessageType('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <Trash2 className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Account Deletion Request</h1>
            <p className="text-gray-600">Delete your account permanently from [Valon]</p>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            messageType === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {messageType === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message}</span>
          </div>
        )}

        {/* Step 1: Phone Number */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <Phone className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h2 className="text-2xl font-semibold text-gray-800">Enter Your Phone Number</h2>
              <p className="text-gray-600 mt-2">We'll verify your account using your registered mobile number</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your registered phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handlePhoneSubmit}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Checking...' : 'Verify Phone Number'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Email Verification */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <Mail className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h2 className="text-2xl font-semibold text-gray-800">Verify Your Email</h2>
              <p className="text-gray-600 mt-2">Enter your email address to receive verification code</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSendVerification}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Sending...' : 'Send Code'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Verification Code */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <Shield className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <h2 className="text-2xl font-semibold text-gray-800">Enter Verification Code</h2>
              <p className="text-gray-600 mt-2">We sent a verification code to {email}</p>
            </div>

            <form onSubmit={handleVerifyAndDelete} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-lg tracking-widest"
                  maxLength="6"
                  required
                />
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800">Warning: This action is permanent</h4>
                    <p className="text-red-700 text-sm mt-1">
                      Your account and all associated data will be permanently deleted and cannot be recovered.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Deleted Successfully</h2>
            <p className="text-gray-600 mb-6">
              Your account has been permanently deleted. All your data has been removed from our servers.
            </p>
            <button
              onClick={resetForm}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Delete Another Account
            </button>
          </div>
        )}

        {/* Data Information */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">What Gets Deleted</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Permanently Deleted:</h4>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• Personal information (name, phone, email)</li>
                <li>• Profile image and address data</li>
                <li>• Shopping cart and preferences</li>
                <li>• Authentication tokens</li>
              </ul>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Retained (Legal Requirements):</h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Order history (3 years for tax purposes)</li>
                <li>• Payment records (as required by law)</li>
                <li>• Customer service logs (1 year)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p>&copy; 2025 [Valon]. All rights reserved.</p>
          <p className="text-sm mt-2">
            Need help? Contact us at: <a href="mailto:support@yourapp.com" className="text-blue-600 hover:underline">support@yourapp.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;