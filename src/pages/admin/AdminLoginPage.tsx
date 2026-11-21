import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { Lock, ArrowLeft, HelpCircle, ShieldAlert } from 'lucide-react';
import { auth, BOOTSTRAPPED_ADMIN_EMAIL, googleProvider } from '../../lib/firebase';
import { useHotel } from '../../context/HotelContext';
import { useToast } from '../../components/common/Toast';

export function AdminLoginPage() {
  const { user, isAdmin } = useHotel();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      if (forgotMode) {
        await sendPasswordResetEmail(auth, email.trim());
        showToast('Password reset email sent if the account exists.', 'success');
        setForgotMode(false);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        showToast('Signed in. Verifying administrator privileges...', 'info');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Authentication failed.';
      setErrorMsg(msg);
      showToast('Authentication failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google sign-in cancelled or failed.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public Website</span>
        </Link>

        <div className="bg-white border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-900 text-[#C9A461] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Mankamana Guest House</p>
              <h1 className="text-xl font-semibold text-slate-900">
                {forgotMode ? 'Reset Admin Password' : 'Management Portal'}
              </h1>
            </div>
          </div>

          {user && !isAdmin && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <span>Unauthorized Account</span>
              </div>
              <p>
                Signed in as <span className="font-mono">{user.email}</span>, which is not authorized as a hotel administrator (or email is unverified).
              </p>
              <button
                type="button"
                onClick={() => void signOut(auth)}
                className="underline font-medium text-red-800"
              >
                Sign out and switch account
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Administrator Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mankamanaguesthouse.com"
                className="w-full px-3.5 py-2.5 border border-slate-300 text-sm focus:outline-none focus:border-slate-900"
              />
            </div>

            {!forgotMode && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setForgotMode(true)}
                    className="text-xs text-slate-600 hover:text-slate-900 underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 text-sm focus:outline-none focus:border-slate-900"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60 transition-colors"
            >
              {submitting
                ? 'Please wait...'
                : forgotMode
                ? 'Send Password Reset Email'
                : 'Sign In with Email'}
            </button>

            {forgotMode && (
              <button
                type="button"
                onClick={() => setForgotMode(false)}
                className="w-full py-2 text-xs text-slate-600 hover:text-slate-900"
              >
                Return to Sign In
              </button>
            )}
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 border border-slate-300 bg-white text-slate-800 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue with Google</span>
          </button>

          <div className="mt-6 pt-5 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowGuide((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showGuide ? 'Hide Initial Admin Setup Guide' : 'Initial Admin Setup Guide'}</span>
            </button>

            {showGuide && (
              <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 leading-relaxed">
                <p className="font-semibold text-slate-800">Authorized Access Only</p>
                <p>
                  Public registration is disabled. Sign in with Google using the bootstrapped owner account (
                  <span className="font-mono text-slate-800">{BOOTSTRAPPED_ADMIN_EMAIL}</span>) or an account added to the Firestore <span className="font-mono">admins</span> collection.
                </p>
                <p>
                  To use Email & Password login: open Firebase Console &rarr; Authentication &rarr; Sign-in method, enable <strong>Email/Password</strong>, create your admin user, and add their UID to <span className="font-mono">admins/&#123;uid&#125;</span> in Firestore (or via Dashboard Settings).
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
