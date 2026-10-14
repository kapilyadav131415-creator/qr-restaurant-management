import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Printer, CreditCard, Split, Percent, XCircle, ArrowLeft, Receipt, CheckCircle2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { billingApi } from '../api';
import type { BillMaster } from '../types';

export default function BillingScreen() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState<BillMaster | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modals state
  const [activeModal, setActiveModal] = useState<'payment' | 'split' | 'discount' | 'cancel' | null>(null);

  // Discount state
  const [discountValue, setDiscountValue] = useState('');
  const [discountType, setDiscountType] = useState<'flat' | 'percent'>('flat');

  // Payment state
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [cashReceived, setCashReceived] = useState('');

  const fetchBill = async () => {
    try {
      setLoading(true);
      const data = await billingApi.generateBill(Number(orderId));
      setBill(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch bill');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBill();
  }, [orderId]);

  const handleApplyDiscount = async () => {
    if (!bill || isProcessing) return;
    setIsProcessing(true);
    try {
      const updatedBill = await billingApi.applyDiscount(bill.bill_id, Number(discountValue), discountType === 'percent');
      setBill(updatedBill);
      toast.success('Discount applied');
      setActiveModal(null);
    } catch (error: any) {
      toast.error('Failed to apply discount');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePay = async () => {
    if (!bill || isProcessing) return;
    setIsProcessing(true);
    const amount = Number(paymentAmount) || Number(bill.grand_total);
    try {
      const updatedBill = await billingApi.payBill(bill.bill_id, [{ mode: paymentMode, amount }]);
      setBill(updatedBill);
      toast.success('Payment recorded');
      setActiveModal(null);
    } catch (error: any) {
      toast.error('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase text-sm">Generating Bill...</p>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500 font-bold text-xl">Could not load bill details.</p>
      </div>
    );
  }

  const amountRemaining = Number(bill.grand_total) - bill.payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const isPaid = bill.bill_status === 'Closed';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950 p-4 md:p-8 font-sans">
      <Toaster />
      
      {/* Top Navigation */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center print:hidden">
        <button onClick={() => navigate(-1)} className="p-3 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 backdrop-blur-md rounded-full transition-all shadow-sm flex items-center justify-center">
          <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: REALISTIC RECEIPT (PRINT AREA) */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-[400px] bg-white rounded-t-sm rounded-b-sm shadow-2xl overflow-hidden relative print-area text-black font-mono">
            {/* Thermal Receipt jagged edge top */}
            <div className="h-4 w-full" style={{ background: 'linear-gradient(-45deg, transparent 4px, white 4px, white 8px, transparent 8px), linear-gradient(45deg, transparent 4px, white 4px, white 8px, transparent 8px)', backgroundSize: '16px 16px', backgroundColor: 'transparent', transform: 'translateY(-8px) scaleY(0.5)' }}></div>
            
            <div className="p-8 pt-4 pb-12">
              <div className="text-center border-b-2 border-dashed border-gray-300 pb-6 mb-6">
                <h2 className="text-2xl font-black uppercase tracking-widest">RESTAURANT</h2>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Tax Invoice</p>
                <div className="mt-4 text-sm font-bold flex flex-col items-center">
                  <p>Bill: {bill.bill_number}</p>
                  <p>Order: #{bill.order_id} | Table: {bill.table_id || 'N/A'}</p>
                  <p>Date: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4 mb-6 border-b-2 border-dashed border-gray-300 pb-6">
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-2">
                  <span className="w-1/2">Item</span>
                  <span className="w-1/4 text-center">Qty</span>
                  <span className="w-1/4 text-right">Amount</span>
                </div>
                {bill.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-sm">
                    <div className="w-1/2 pr-2">
                      <p className="font-bold">{item.item_name}</p>
                      {item.variant_name && <p className="text-xs text-gray-500">[{item.variant_name}]</p>}
                    </div>
                    <div className="w-1/4 text-center font-bold">{item.qty}</div>
                    <div className="w-1/4 text-right font-bold">₹{item.total_amount}</div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm font-bold border-b-2 border-dashed border-gray-300 pb-6 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{bill.subtotal}</span>
                </div>
                {Number(bill.discount_amount) > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Discount</span>
                    <span>- ₹{bill.discount_amount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span>₹{bill.gst_amount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Charge</span>
                  <span>₹{bill.service_charge}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Round Off</span>
                  <span>₹{bill.round_off}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-center text-xl font-black">
                <span className="uppercase tracking-widest">Total</span>
                <span>₹{bill.grand_total}</span>
              </div>

              {/* Payment Status Overlay */}
              {isPaid && (
                <div className="mt-8 pt-8 border-t-2 border-dashed border-gray-300 text-center">
                  <div className="inline-block border-4 border-black px-6 py-2 rounded-lg transform -rotate-12">
                    <span className="text-3xl font-black uppercase tracking-widest text-black">PAID</span>
                  </div>
                </div>
              )}
            </div>
            
             {/* Thermal Receipt jagged edge bottom */}
             <div className="h-4 w-full" style={{ background: 'linear-gradient(-45deg, transparent 4px, white 4px, white 8px, transparent 8px), linear-gradient(45deg, transparent 4px, white 4px, white 8px, transparent 8px)', backgroundSize: '16px 16px', backgroundColor: 'transparent', transform: 'translateY(8px) scaleY(0.5)' }}></div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTION DASHBOARD */}
        <div className="w-full lg:w-[450px] flex flex-col gap-6 print:hidden">
          
          {/* Glassmorphic Summary Card */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-[2rem] p-8 shadow-2xl">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">Payment Status</h3>
            
            <div className="flex items-center justify-between mb-8">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${isPaid ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'}`}>
                {bill.bill_status}
              </span>
              
              {!isPaid && (
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Amount Due</p>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">₹{amountRemaining.toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setActiveModal('payment')}
                disabled={isPaid}
                className="col-span-2 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-gray-900/20 dark:shadow-white/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                <CreditCard size={18} /> Settle Payment
              </button>
              
              <button onClick={handlePrint} className="py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                <Printer size={18} /> Print Bill
              </button>
              
              <button onClick={() => setActiveModal('split')} disabled={isPaid} className="py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-50">
                <Split size={18} /> Split
              </button>
              
              <button onClick={() => setActiveModal('discount')} disabled={isPaid} className="py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-50">
                <Percent size={18} /> Discount
              </button>
              
              <button onClick={() => setActiveModal('cancel')} disabled={isPaid} className="py-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm disabled:opacity-50">
                <XCircle size={18} /> Cancel Bill
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS (Glassmorphic) --- */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; border: none; box-shadow: none; background: white; margin:0; padding:0; }
        }
      `}</style>
      
      {/* Existing Modals implementation kept identical logic, updated UI */}
      {activeModal === 'discount' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Apply Discount</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <button onClick={() => setDiscountType('flat')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${discountType === 'flat' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Flat (₹)</button>
                <button onClick={() => setDiscountType('percent')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${discountType === 'percent' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Percent (%)</button>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Value</label>
                <input type="number" value={discountValue} onChange={e => setDiscountValue(e.target.value)} className="w-full p-4 text-2xl font-black bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white dark:text-white" placeholder="0.00" />
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <button onClick={() => setActiveModal(null)} disabled={isProcessing} className="flex-1 py-3 font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">Cancel</button>
              <button onClick={handleApplyDiscount} disabled={isProcessing} className="flex-1 py-3 font-bold text-white dark:text-black bg-gray-900 dark:bg-white rounded-xl hover:bg-black dark:hover:bg-gray-200 flex items-center justify-center gap-2 disabled:opacity-50">
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'payment' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Settle Payment</h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Amount Due</p>
                <p className="text-4xl font-black text-gray-900 dark:text-white mt-1">₹{amountRemaining.toFixed(2)}</p>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Cash', 'UPI', 'Card'].map(mode => (
                    <button key={mode} onClick={() => setPaymentMode(mode)} className={`py-3 rounded-xl font-bold text-sm border-2 transition-colors ${paymentMode === mode ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-black' : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600'}`}>
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Paying Amount</label>
                <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} placeholder={amountRemaining.toFixed(2)} className="w-full p-4 text-xl font-black bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white dark:text-white" />
              </div>

              {paymentMode === 'Cash' && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Cash Received</label>
                  <input type="number" value={cashReceived} onChange={e => setCashReceived(e.target.value)} placeholder="0.00" className="w-full p-4 text-xl font-black bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white dark:text-white" />
                  {Number(cashReceived) > (Number(paymentAmount) || amountRemaining) && (
                    <p className="text-sm font-bold text-green-600 mt-2">
                      Return Change: ₹{(Number(cashReceived) - (Number(paymentAmount) || amountRemaining)).toFixed(2)}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <button onClick={() => setActiveModal(null)} disabled={isProcessing} className="flex-1 py-4 font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">Cancel</button>
              <button onClick={handlePay} disabled={isProcessing} className="flex-1 py-4 font-black text-white dark:text-black bg-gray-900 dark:bg-white rounded-xl hover:bg-black dark:hover:bg-gray-200 uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50">
                {isProcessing ? <Loader2 size={20} className="animate-spin" /> : 'Confirm Pay'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
