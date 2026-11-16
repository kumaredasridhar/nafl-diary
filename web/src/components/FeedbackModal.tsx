import { useState } from 'react';
import { FeedbackItem } from '../data/mockData';
import {
  MessageSquare,
  FileCheck,
  CheckCircle,
  Clock,
  Send,
  UserCheck
} from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedbackList: FeedbackItem[];
  onAcknowledgeFeedback: (id: string) => void;
  onSendFeedback: (item: FeedbackItem) => void;
  userRole: 'parent' | 'teacher' | 'principal' | 'admin';
}

export const FeedbackModal = ({
  isOpen,
  onClose,
  feedbackList,
  onAcknowledgeFeedback,
  onSendFeedback,
  userRole,
}: FeedbackModalProps) => {
  const isTeacher = userRole === 'teacher';
  const [filter, setFilter] = useState<'all' | 'remarks' | 'inquiries' | 'sent'>('all');
  const [showNewForm, setShowNewForm] = useState(false);
  const [targetStudent, setTargetStudent] = useState('Aarav Sharma (Mont 1A)');
  const [recipient, setRecipient] = useState<'Teacher' | 'Principal' | 'Parent'>(
    isTeacher ? 'Parent' : 'Teacher'
  );
  const [category, setCategory] = useState<FeedbackItem['category']>('Academic Progress');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [requiresSign, setRequiresSign] = useState(isTeacher);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newItem: FeedbackItem = {
      id: `fb-${Date.now()}`,
      recipient: isTeacher ? 'Parent' : recipient,
      senderRole: isTeacher ? 'teacher' : 'parent',
      senderName: isTeacher ? 'Ms. Ananya (Class Teacher)' : 'Rajesh Sharma (Father)',
      category,
      date: 'Today',
      title: isTeacher ? `[To Parent of ${targetStudent.split(' ')[0]}] ${title.trim()}` : title.trim(),
      message: message.trim(),
      requiresAcknowledgement: requiresSign,
      acknowledged: false,
    };

    onSendFeedback(newItem);
    setTitle('');
    setMessage('');
    setShowNewForm(false);
  };

  const pendingParentAck = feedbackList.filter(
    f => f.requiresAcknowledgement && !f.acknowledged && f.recipient === 'Parent'
  ).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl border border-brand-200 bg-brand-50/70 text-brand-600 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base sm:text-lg">
                {isTeacher ? 'Mont 1A — Parent Communication Desk' : 'Teacher & Principal Feedback Channel'}
              </h2>
              <p className="text-xs text-slate-500">
                {isTeacher ? 'Send official teacher remarks or respond to parent inquiries' : 'Documented 1-on-1 notes with acknowledgement receipts'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-bold p-1 leading-none"
          >
            &times;
          </button>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between gap-3">
          {pendingParentAck > 0 && !isTeacher ? (
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{pendingParentAck} Teacher remark requires your acknowledgement</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-medium">
              {isTeacher ? 'Class Mont 1A Channel • Controlled communication hours' : 'Controlled communication window (8:00 AM – 4:00 PM)'}
            </div>
          )}

          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>{showNewForm ? 'Cancel' : isTeacher ? 'Send Parent Remark' : 'Send New Note'}</span>
          </button>
        </div>

        {/* New Note Form */}
        {showNewForm && (
          <form
            onSubmit={handleSubmit}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs animate-fade-in"
          >
            <h4 className="font-bold text-slate-900 text-sm">
              {isTeacher ? 'Compose Documented Remark to Parent' : 'Compose Note to School'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isTeacher ? 'Select Student / Parent' : 'Send To'}
                </label>
                {isTeacher ? (
                  <select
                    value={targetStudent}
                    onChange={e => setTargetStudent(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Aarav Sharma (Mont 1A)">Parent of Aarav Sharma (Mont 1A)</option>
                    <option value="Ananya Rao (Mont 1A)">Parent of Ananya Rao (Mont 1A)</option>
                    <option value="Kabir Nair (Mont 1A)">Parent of Kabir Nair (Mont 1A)</option>
                    <option value="Diya Patel (Mont 1A)">Parent of Diya Patel (Mont 1A)</option>
                  </select>
                ) : (
                  <select
                    value={recipient}
                    onChange={e => setRecipient(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Teacher">Class Teacher (Ms. Ananya)</option>
                    <option value="Principal">Office of the Principal</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Academic Progress">Academic Progress</option>
                  <option value="Behavioral Note">Behavioral Note</option>
                  <option value="General">General / Well-being</option>
                  <option value="Appreciation">Appreciation</option>
                  <option value="Infrastructure">Infrastructure / Campus</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                placeholder={isTeacher ? "e.g. Observation during Sensorial math activity..." : "Brief summary..."}
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Detailed Message</label>
              <textarea
                rows={3}
                placeholder={isTeacher ? "Write detailed remarks or instructions for the parent..." : "Write your note here..."}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200"
                required
              />
            </div>

            {isTeacher && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="reqAck"
                  checked={requiresSign}
                  onChange={e => setRequiresSign(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600"
                />
                <label htmlFor="reqAck" className="font-medium text-slate-700 cursor-pointer">
                  Require digital signature / acknowledgement checkbox from parent
                </label>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800"
              >
                {isTeacher ? 'Send Remark to Parent' : 'Send Message'}
              </button>
            </div>
          </form>
        )}

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Messages ({feedbackList.length})
          </button>
          <button
            onClick={() => setFilter('remarks')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'remarks'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isTeacher ? 'Sent to Parents' : 'Teacher Remarks'}
          </button>
          {isTeacher ? (
            <button
              onClick={() => setFilter('inquiries')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filter === 'inquiries'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Parent Inquiries
            </button>
          ) : (
            <button
              onClick={() => setFilter('sent')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filter === 'sent'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Notes Sent by Me
            </button>
          )}
        </div>

        {/* Feedback List */}
        <div className="space-y-3.5">
          {feedbackList
            .filter(item => {
              if (isTeacher) {
                if (filter === 'remarks') return item.recipient === 'Parent';
                if (filter === 'inquiries') return item.recipient === 'Teacher';
                return true;
              } else {
                if (filter === 'remarks') return item.recipient === 'Parent';
                if (filter === 'sent') return item.senderRole === 'parent';
                return true;
              }
            })
            .map(item => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.requiresAcknowledgement && !item.acknowledged
                  ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-400/20'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500">
                      From: <strong className="text-slate-800">{item.senderName}</strong>
                    </span>
                    <span className="text-xs text-slate-400">• {item.date}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                </div>

                {/* Acknowledgement Status / Action */}
                <div className="shrink-0 text-right">
                  {item.requiresAcknowledgement ? (
                    item.acknowledged ? (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Signed by Parent</span>
                      </div>
                    ) : isTeacher ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Awaiting Parent Signature</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onAcknowledgeFeedback(item.id)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Sign & Acknowledge</span>
                      </button>
                    )
                  ) : (
                    <span className="text-[10px] text-slate-400">Delivered</span>
                  )}
                </div>
              </div>

              {/* Reply thread if present */}
              {item.reply && (
                <div className="mt-3 pt-3 border-t border-slate-100 pl-3 border-l-2 border-brand-500 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-700">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Response from {item.replyAuthor}</span>
                    <span className="text-slate-400 font-normal">({item.replyDate})</span>
                  </div>
                  <p className="text-xs text-slate-700">{item.reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
