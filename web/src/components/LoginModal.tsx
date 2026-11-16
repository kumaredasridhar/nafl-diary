import { useState } from 'react';
import { School, User, LogIn, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export interface UserSession {
  role: 'parent' | 'teacher' | 'principal' | 'admin';
  name: string;
  identifier: string; // admission # or staff email
  childName?: string;
  grade?: string;
  assignedSectionId?: string; // e.g. 'mont-1a' for Ms. Ananya
  department?: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (session: UserSession) => void;
}

export const LoginModal = ({ isOpen, onClose, onLogin }: LoginModalProps) => {
  const [activeTab, setActiveTab] = useState<'parent' | 'teacher'>('parent');
  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !pin.trim()) {
      setError('Please enter your credentials');
      return;
    }

    if (activeTab === 'parent') {
      onLogin({
        role: 'parent',
        name: 'Rajesh Sharma',
        identifier: identifier.trim(),
        childName: 'Aarav Sharma',
        grade: 'Mont 1A',
        assignedSectionId: 'mont-1a'
      });
    } else {
      onLogin({
        role: 'teacher',
        name: 'Ms. Ananya',
        identifier: identifier.trim(),
        grade: 'Mont 1',
        assignedSectionId: 'mont-1a'
      });
    }
    onClose();
  };

  const handleQuickDemoLogin = (role: 'parent' | 'teacher' | 'admin' | 'principal') => {
    if (role === 'parent') {
      onLogin({
        role: 'parent',
        name: 'Rajesh Sharma',
        identifier: 'NAFL/2026/M1-042',
        childName: 'Aarav Sharma',
        grade: 'Mont 1A',
        assignedSectionId: 'mont-1a'
      });
    } else if (role === 'teacher') {
      onLogin({
        role: 'teacher',
        name: 'Ms. Ananya',
        identifier: 'ananya@nafl.in',
        grade: 'Mont 1',
        assignedSectionId: 'mont-1a'
      });
    } else if (role === 'admin') {
      onLogin({
        role: 'admin',
        name: 'Mr. Sundaram',
        identifier: 'registrar@nafl.in',
        department: 'Registrar & Admissions Desk'
      });
    } else {
      onLogin({
        role: 'principal',
        name: 'Office of the Principal',
        identifier: 'principal@nafl.in'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl border border-brand-200 bg-brand-50/70 text-brand-600 flex items-center justify-center font-bold">
              <School className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">NAFL Portal Login</h2>
              <p className="text-xs text-slate-500">Sign in to your school account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-bold p-1 leading-none"
          >
            &times;
          </button>
        </div>

        {/* 1-Tap Quick Demo Logins for Testing */}
        <div className="p-3.5 bg-brand-50/60 border border-brand-200/80 rounded-2xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-900 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" strokeWidth={1.75} />
            <span>1-Tap Instant Sign-In:</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleQuickDemoLogin('parent')}
              className="p-2.5 bg-white hover:bg-brand-100/50 border border-brand-200 text-left rounded-xl transition-all shadow-2xs"
            >
              <div className="font-bold text-slate-900">👨‍👩‍👧 Parent</div>
              <div className="text-[10px] text-slate-500 truncate">Aarav (1A)</div>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('teacher')}
              className="p-2.5 bg-white hover:bg-brand-100/50 border border-brand-200 text-left rounded-xl transition-all shadow-2xs"
            >
              <div className="font-bold text-slate-900">👩‍🏫 Teacher</div>
              <div className="text-[10px] text-slate-500 truncate">Ms. Ananya</div>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="p-2.5 bg-white hover:bg-indigo-100/50 border border-indigo-200 text-left rounded-xl transition-all shadow-2xs"
            >
              <div className="font-bold text-indigo-950">👨‍💼 Admin</div>
              <div className="text-[10px] text-indigo-700 truncate">Office Desk</div>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('parent')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'parent' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Parent Login
          </button>
          <button
            onClick={() => setActiveTab('teacher')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'teacher' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Staff / Teacher
          </button>
        </div>

        {/* Standard PIN Login form */}
        <form onSubmit={handleManualLogin} className="space-y-3.5">
          {error && (
            <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {activeTab === 'parent' ? 'Registered Mobile or Admission No.' : 'Staff Email / ID'}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={activeTab === 'parent' ? 'e.g. 9886012345 or NAFL/2026/M1-042' : 'e.g. ananya@nafl.in'}
                value={identifier}
                onChange={e => {
                  setIdentifier(e.target.value);
                  setError(null);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" strokeWidth={1.75} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Security PIN / Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="4-digit PIN (default: 1234)"
                value={pin}
                onChange={e => {
                  setPin(e.target.value);
                  setError(null);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" strokeWidth={1.75} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <LogIn className="w-4 h-4" strokeWidth={1.75} />
            <span>Sign In to School Portal</span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-center text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" strokeWidth={1.75} />
            Encrypted & Secure Session
          </span>
        </div>
      </div>
    </div>
  );
};
