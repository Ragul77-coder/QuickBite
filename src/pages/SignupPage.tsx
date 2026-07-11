import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const SignupPage: React.FC = () => {
  const { signup } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpMode, setOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const rawRedirect = searchParams.get('redirect') || '/';
  const redirect = rawRedirect.startsWith('/') ? rawRedirect : `/${rawRedirect}`;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      toast.error('All fields are required.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setOtpMode(true);
      toast.success('Registration code sent to mobile & email!');
    }, 1200);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 4) {
      toast.error('Please enter a 4-digit code.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      signup(name, email, phone);
      toast.success('Account created successfully!');
      navigate(redirect);
    }, 1000);
  };

  return (
    <div className="py-12 max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">
            {otpMode ? 'Verify OTP' : 'Create Account'}
          </h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            {otpMode
              ? `Enter the 4-digit code sent to ${phone}`
              : 'Register to unlock free coupons, save addresses and track orders'
            }
          </p>
        </div>

        {!otpMode ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              leftIcon={<User className="h-4.5 w-4.5" />}
            />
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@example.com"
              leftIcon={<Mail className="h-4.5 w-4.5" />}
            />
            <Input
              label="Phone Number"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              leftIcon={<Phone className="h-4.5 w-4.5" />}
            />
            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="h-4.5 w-4.5" />}
            />
            <Button type="submit" variant="primary" isLoading={loading} className="w-full rounded-xl py-3 shadow-md shadow-orange-500/10">
              Register <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block text-center">4-Digit Code</label>
              <div className="flex justify-center">
                <input
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="1234"
                  className="w-28 text-center text-2xl font-black py-2.5 tracking-widest rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
            <Button type="submit" variant="primary" isLoading={loading} className="w-full rounded-xl py-3 shadow-md shadow-orange-500/10">
              Verify & Register
            </Button>
            <div className="text-center">
              <button type="button" onClick={() => setOtpMode(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-250 cursor-pointer">
                Back to Registration
              </button>
            </div>
          </form>
        )}

        {!otpMode && (
          <div className="text-center text-xs border-t border-slate-100 dark:border-slate-800 pt-4 font-semibold text-slate-450 dark:text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 font-extrabold hover:underline">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
