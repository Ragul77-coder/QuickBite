import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success('Password reset link sent to email!');
    }, 1200);
  };

  return (
    <div className="py-12 max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl space-y-6">
        
        {/* Back Link */}
        <Link to="/login" className="flex items-center gap-1 text-xs font-bold text-slate-450 hover:text-slate-700 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Sign In
        </Link>

        {!sent ? (
          <>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">Recover Password</h2>
              <p className="text-xs text-slate-450 dark:text-slate-500 leading-relaxed font-semibold">
                Provide your registered email address below. We'll send a secure validation link to reset your account credentials.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                leftIcon={<Mail className="h-4.5 w-4.5" />}
              />
              <Button type="submit" variant="primary" isLoading={loading} className="w-full rounded-xl py-3 shadow-md shadow-orange-500/10">
                Send Reset Link <Send className="h-4 w-4 ml-1.5" />
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-9 w-9" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-950 dark:text-white">Reset Link Sent</h3>
              <p className="text-xs text-slate-450 dark:text-slate-500 font-semibold leading-relaxed">
                An email containing password recovery steps has been dispatched to <span className="text-slate-900 dark:text-white font-extrabold">{email}</span>. Please verify your inbox and spam folders.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
