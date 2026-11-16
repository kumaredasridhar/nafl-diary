import { useState } from 'react';
import { FeeRecord } from '../data/mockData';
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Clock,
  Clock3,
  Shirt,
  PhoneCall,
  CalendarCheck,
  BookOpen,
  ClipboardList,
  Shield,
  Printer,
  X,
  CheckCircle
} from 'lucide-react';

interface ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  fees: FeeRecord[];
  userRole?: 'parent' | 'teacher' | 'principal' | 'admin';
}

export const ReferenceModal = ({
  isOpen,
  onClose,
  fees,
  userRole = 'parent',
}: ReferenceModalProps) => {
  const isTeacher = userRole === 'teacher';
  const [activeReceipt, setActiveReceipt] = useState<FeeRecord | null>(null);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl border border-brand-200 bg-brand-50/70 text-brand-600 flex items-center justify-center font-bold">
                {isTeacher ? <BookOpen className="w-5 h-5" strokeWidth={1.75} /> : <FileSpreadsheet className="w-5 h-5" strokeWidth={1.75} />}
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base sm:text-lg">
                  {isTeacher ? 'Teacher Reference & Academic Guidelines' : 'School Reference & Fee Records'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isTeacher ? 'Montessori classroom procedures, staff directory & schedules' : 'Fee receipts, academic handbook & guidelines'}
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

          {/* SECTION FOR PARENTS ONLY: Tuition Fee Ledger (Hidden for Teachers) */}
          {!isTeacher && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-brand-600" strokeWidth={1.75} />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Tuition Fee Payment History (2026–2027)
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Up-to-Date
                </span>
              </div>

              <div className="space-y-2">
                {fees.map(fee => (
                  <div
                    key={fee.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{fee.termTitle}</span>
                        {fee.status === 'Paid' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" strokeWidth={1.75} /> Paid
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" strokeWidth={1.75} /> Due {fee.dueDate}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 text-[11px] mt-1 space-x-2">
                        <span>Amount: <strong className="text-slate-800">{fee.amount}</strong></span>
                        {fee.paidOn && <span>• Paid on: {fee.paidOn}</span>}
                        {fee.receiptNumber && <span>• Ref: {fee.receiptNumber}</span>}
                      </div>
                    </div>

                    {fee.status === 'Paid' && (
                      <button
                        onClick={() => setActiveReceipt(fee)}
                        className="self-start sm:self-auto px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 font-semibold text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5 text-brand-600" strokeWidth={1.75} />
                        <span>View / Download Receipt</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION FOR TEACHERS: Classroom Guidelines & Inventory Protocol */}
          {isTeacher && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-200/80 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-brand-900">
                  <ClipboardList className="w-4 h-4 text-brand-600" strokeWidth={1.75} />
                  <span>Montessori Classroom Inventory & Maintenance Protocol</span>
                </div>
                <ul className="text-slate-700 space-y-1 list-disc list-inside">
                  <li>Sanitize sensorial sandpaper letters and touch boards every Friday afternoon.</li>
                  <li>Verify count of wooden pink tower cubes (10) and brown stairs before leaving.</li>
                  <li>Requisition art/craft materials for the next month by the 20th of the current month.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Shield className="w-4 h-4 text-amber-600" strokeWidth={1.75} />
                  <span>Staff Absence & Proxy Coordination</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Inform the Montessori Section Coordinator (Ms. Sheila) via app before 07:15 AM on the day of unplanned absence to ensure morning gate and circle coverage.
                </p>
              </div>
            </div>
          )}

          {/* Daily Schedule / School Timings */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Clock3 className="w-4 h-4 text-brand-600" strokeWidth={1.75} />
              <span>Campus Hours & Timings</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="font-semibold block text-slate-900">Student Routine</span>
                <span>08:30 AM – 12:30 PM (Monday to Friday)</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="font-semibold block text-slate-900">Staff Work Hours</span>
                <span>08:00 AM – 03:30 PM (Monday to Friday)</span>
              </div>
            </div>
          </div>

          {/* Uniform Code (More relevant for parents) */}
          {!isTeacher && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Shirt className="w-4 h-4 text-purple-600" strokeWidth={1.75} />
                <span>Student Uniform Guidelines</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                • <strong>Mon, Tue, Thu:</strong> Regular school uniform with black leather Velcro shoes.<br />
                • <strong>Wed & Fri:</strong> House colored T-shirt with navy shorts/track pants & white PT sneakers.<br />
                • All personal items (water bottles, sweaters, lunch bags) must be clearly labeled with student admission number.
              </p>
            </div>
          )}

          {/* Key School / Staff Contacts */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <PhoneCall className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
              <span>{isTeacher ? 'Internal Staff Extensions' : 'Key School Contacts'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700">
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="font-bold block text-slate-900">Front Desk / Office</span>
                <span className="text-[11px]">+91 80 2528 1234</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="font-bold block text-slate-900">Transport Desk</span>
                <span className="text-[11px]">+91 98860 99881</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="font-bold block text-slate-900">School Infirmary</span>
                <span className="text-[11px]">+91 80 2528 1238</span>
              </div>
            </div>
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

      {/* Official Tuition Fee Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* School Receipt Banner */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <span className="text-[11px] font-bold text-brand-700 tracking-wider uppercase block">
                  National Academy For Learning
                </span>
                <h3 className="font-black text-lg text-slate-900">
                  OFFICIAL TUITION FEE RECEIPT
                </h3>
                <p className="text-[11px] text-slate-500">
                  Basaveshwarnagar, Bengaluru — 560079 | Affiliated to CISCE & CAIE
                </p>
              </div>
              <button
                onClick={() => setActiveReceipt(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Meta Details */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Receipt Number</span>
                <span className="font-mono font-bold text-slate-900">{activeReceipt.receiptNumber || 'NAFL/REC/2026-27/0842'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Receipt Date</span>
                <span className="font-semibold text-slate-800">{activeReceipt.paidOn || '10 June 2026'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Name</span>
                <span className="font-bold text-slate-900">Aarav Sharma</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Admission / Section</span>
                <span className="font-semibold text-brand-700">NAFL-2026-084 • Mont 1A</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment Gateway Reference</span>
                <span className="font-mono text-slate-700">HDFC SmartHub Auto-Clear • Txn ID #TXN-90284718-NAFL</span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <div className="bg-slate-100 px-4 py-2 font-bold text-slate-700 flex justify-between border-b border-slate-200">
                <span>Fee Description</span>
                <span>Amount (INR)</span>
              </div>
              <div className="divide-y divide-slate-100 p-1">
                <div className="px-3 py-2 flex justify-between text-slate-700">
                  <span>{activeReceipt.termTitle} Tuition & Instruction</span>
                  <span className="font-medium">₹34,000.00</span>
                </div>
                <div className="px-3 py-2 flex justify-between text-slate-700">
                  <span>Montessori Sensorial Lab & Activity Kit</span>
                  <span className="font-medium">₹5,500.00</span>
                </div>
                <div className="px-3 py-2 flex justify-between text-slate-700">
                  <span>Library & Digital Resources Fee</span>
                  <span className="font-medium">₹3,000.00</span>
                </div>
              </div>
              <div className="bg-slate-900 text-white px-4 py-2.5 flex justify-between font-bold text-sm">
                <span>Total Amount Paid</span>
                <span className="text-emerald-400">{activeReceipt.amount}</span>
              </div>
            </div>

            {/* Official Paid Stamp */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-950 block">PAID & RECONCILED</span>
                  <span className="text-[11px] text-emerald-700">Authorized by NAFL Accounts Department</span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-white px-2 py-1 rounded-lg border border-emerald-300 text-emerald-800">
                ORIGINAL FOR PARENT
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveReceipt(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Close Receipt
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
