import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, X, Loader2, MessageSquare, Utensils, User, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { feedbackApi } from '../../feedback/api';
import { useCart } from '../context/CartContext';

interface FeedbackFormProps {
  restaurantId: number;
  branchId?: number;
  orderId?: number;
  onClose: () => void;
  primaryColor?: string;
}

export default function FeedbackForm({ restaurantId, branchId, orderId, onClose, primaryColor = '#ea580c' }: FeedbackFormProps) {
  const { customerInfo } = useCart();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  const [foodRating, setFoodRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [ambianceRating, setAmbianceRating] = useState(0);
  const [comments, setComments] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please provide an overall rating');
      return;
    }

    try {
      setLoading(true);
      await feedbackApi.submitFeedback({
        restaurant_id: restaurantId,
        branch_id: branchId,
        order_id: orderId,
        customer_name: customerInfo?.name || 'Anonymous',
        customer_phone: customerInfo?.mobile || '',
        rating_overall: rating,
        rating_food: foodRating || undefined,
        rating_service: serviceRating || undefined,
        rating_ambiance: ambianceRating || undefined,
        comments
      });
      toast.success('Thank you for your valuable feedback! 🙏');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ value, onChange, size = 'large' }: any) => {
    const [hover, setHover] = useState(0);
    return (
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star 
              size={size === 'large' ? 36 : 24} 
              className={`transition-colors ${(hover || value) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative"
    >
      <div className="p-6 bg-gray-50 flex justify-between items-center border-b border-gray-100">
        <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Heart size={20} style={{ color: primaryColor }} />
          Rate Your Experience
        </h2>
        <button 
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-400 hover:text-gray-600 shadow-sm border border-gray-100"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="text-center py-4 bg-gray-50 rounded-3xl border border-gray-100">
            <p className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-widest">Overall Experience</p>
            <div className="flex justify-center">
              <StarRating value={rating} onChange={setRating} size="large" />
            </div>
            {rating > 0 && (
              <p className="text-sm font-black mt-3" style={{ color: primaryColor }}>
                {['Terrible 😞', 'Bad 😕', 'Okay 😐', 'Good 😊', 'Awesome! 🤩'][rating - 1]}
              </p>
            )}
          </div>

          <div className="space-y-4 pt-2">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Detailed Ratings (Optional)</p>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2">
                <Utensils size={18} className="text-orange-500" />
                <span className="font-bold text-sm text-gray-700">Food Quality</span>
              </div>
              <StarRating value={foodRating} onChange={setFoodRating} size="small" />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2">
                <User size={18} className="text-blue-500" />
                <span className="font-bold text-sm text-gray-700">Service & Staff</span>
              </div>
              <StarRating value={serviceRating} onChange={setServiceRating} size="small" />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-purple-500" />
                <span className="font-bold text-sm text-gray-700">Ambiance</span>
              </div>
              <StarRating value={ambianceRating} onChange={setAmbianceRating} size="small" />
            </div>
          </div>

          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Anything else?</p>
            <div className="relative">
              <MessageSquare size={16} className="absolute top-4 left-4 text-gray-400" />
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Tell us about your experience..."
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:ring-2 focus:bg-white transition-all min-h-[100px] outline-none"
                style={{ focusRingColor: primaryColor }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || rating === 0}
            className="w-full text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 flex items-center justify-center disabled:hover:translate-y-0"
            style={{ backgroundColor: primaryColor }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Submit Feedback'}
          </button>
          
        </form>
      </div>
    </motion.div>
  );
}
