import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import {
  MapPin, Home, Star, Heart, BedDouble, Bath, Maximize2, Car,
  Wifi, Dumbbell, Waves, Wind, Shield, Zap, Trees, ChevronLeft,
  ChevronRight, X, Phone, Mail, Building2, Calendar, Clock,
  Send, CheckCircle, ChevronDown
} from 'lucide-react';
import Navbar from '../../components/buyer/Navbar';
import PropertyCard from '../../components/PropertyCard';
import { toast } from 'sonner';

// ─── Amenity Icon Map ─────────────────────────────────────────────────────────
const AMENITY_ICONS = {
  wifi: Wifi, gym: Dumbbell, pool: Waves, 'air conditioning': Wind,
  security: Shield, elevator: Zap, garden: Trees, parking: Car,
  default: Home,
};

const getAmenityIcon = (name) => {
  const key = name?.toLowerCase();
  for (const [k, v] of Object.entries(AMENITY_ICONS)) {
    if (key?.includes(k)) return v;
  }
  return AMENITY_ICONS.default;
};

// ─── Star Picker ──────────────────────────────────────────────────────────────
const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button key={s} type="button" onClick={() => onChange(s)} className="focus:outline-none">
        <Star
          size={28}
          className={`transition-colors ${s <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300 hover:text-amber-300'}`}
        />
      </button>
    ))}
  </div>
);

// ─── Star Display ─────────────────────────────────────────────────────────────
const StarDisplay = ({ value, size = 14 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s} size={size}
        className={s <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
      />
    ))}
  </div>
);

// ─── Lightbox ─────────────────────────────────────────────────────────────────
const Lightbox = ({ images, startIndex, onClose }) => {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
      <div className="relative max-w-5xl w-full px-12" onClick={(e) => e.stopPropagation()}>
        <img src={images[idx]} alt="" className="w-full max-h-[80vh] object-contain rounded-xl" />
        {/* Navigation */}
        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all">
          <ChevronLeft size={28} />
        </button>
        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all">
          <ChevronRight size={28} />
        </button>
        {/* Close */}
        <button onClick={onClose} className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors">
          <X size={28} />
        </button>
        {/* Counter */}
        <p className="text-center text-white/70 text-sm mt-3">{idx + 1} / {images.length}</p>
      </div>
    </div>
  );
};

// ─── Schedule Tour Modal ───────────────────────────────────────────────────────
const TourModal = ({ property, onClose, onSubmit, isLoading }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [note, setNote] = useState('');

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-[fadeInUp_0.3s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Schedule a Tour</h2>
            <p className="text-sm text-gray-500 mt-0.5">{property?.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1.5 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Date */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              <Calendar size={14} className="inline mr-1.5 text-blue-500" />
              Select Date
            </label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Time Slots */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              <Clock size={14} className="inline mr-1.5 text-blue-500" />
              Preferred Time
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                    time === t
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Message (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any special requirements or questions..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
          </div>

          <button
            onClick={() => onSubmit({ date, time, note })}
            disabled={!date || isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Calendar size={16} />
            )}
            {isLoading ? 'Submitting...' : 'Request Tour'}
          </button>
          <p className="text-xs text-center text-gray-400 mt-3 font-medium">
            Note: A ₹500 scheduling fee will be charged once the admin confirms this request.
          </p>
        </div>
      </div>
    </div>
  );
};


// ─── Main Component ────────────────────────────────────────────────────────────
const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('Overview');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showTourModal, setShowTourModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Enquiry form state (About tab)
  const [enquiryName, setEnquiryName] = useState(user?.name || '');
  const [enquiryMsg, setEnquiryMsg] = useState('');

  // ── Data Fetching ──
  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data } = await api.get(`/properties/${id}`);
      return data;
    },
  });

  const { data: similarProperties = [] } = useQuery({
    queryKey: ['properties', 'similar', id],
    queryFn: async () => {
      const { data } = await api.get('/properties');
      return data.filter((p) => p._id !== id).slice(0, 3);
    },
  });

  const { data: reviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const { data } = await api.get(`/properties/${id}/reviews`);
      return data;
    },
    enabled: !!id,
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data } = await api.get('/users/favorites');
      return data;
    },
    enabled: !!user,
  });

  // Fetch user's tour status for this property
  const { data: tourStatus, refetch: refetchTourStatus } = useQuery({
    queryKey: ['tourStatus', id],
    queryFn: async () => {
      const { data } = await api.get(`/properties/${id}/tour-status`);
      return data;
    },
    enabled: !!user && !!id,
  });

  // Sync favorite state
  useEffect(() => {
    if (favorites.length > 0 && property) {
      setIsFavorited(favorites.some((f) => f._id === property._id));
    }
  }, [favorites, property]);

  // ── Mutations ──
  const favMutation = useMutation({
    mutationFn: () => api.post('/users/favorites/toggle', { propertyId: id }),
    onMutate: () => setIsFavorited((prev) => !prev),
    onSuccess: () => queryClient.invalidateQueries(['favorites']),
    onError: () => {
      setIsFavorited((prev) => !prev);
      toast.error('Failed to update favorites');
    },
  });

  const reviewMutation = useMutation({
    mutationFn: () => api.post(`/properties/${id}/reviews`, { rating: reviewRating, comment: reviewComment }),
    onSuccess: () => {
      setReviewSubmitted(true);
      setReviewRating(0);
      setReviewComment('');
      refetchReviews();
      toast.success('Review submitted!');
    },
    onError: () => toast.error('Failed to submit review'),
  });

  const enquireMutation = useMutation({
    mutationFn: (payload) => api.post(`/properties/${id}/enquire`, payload),
    onSuccess: () => {
      toast.success('Enquiry sent! The seller will contact you soon.');
      setEnquiryMsg('');
    },
    onError: () => toast.error('Failed to send enquiry'),
  });

  const tourMutation = useMutation({
    mutationFn: (payload) => api.post(`/properties/${id}/enquire`, payload),
    onSuccess: () => {
      toast.success('Tour request sent! The seller will confirm your visit.');
      setShowTourModal(false);
      refetchTourStatus();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to submit tour request'),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }
  if (!property) return <div className="min-h-screen pt-20 text-center text-gray-500">Property not found.</div>;

  const images = (property.images?.length ? property.images : []).concat(
    Array(4).fill('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200')
  ).slice(0, 4);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : property.rating || 0;

  const openLightbox = (i) => { setLightboxIndex(i); setLightboxOpen(true); };

  // ── Tab Content ───────────────────────────────────────────────────────────
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Description */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Description</h2>
        <p className="text-gray-600 leading-relaxed text-[15px]">
          {property.description || 'No description provided for this property.'}
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: BedDouble, label: 'Bedrooms', value: property.bedrooms ?? '—' },
          { icon: Bath, label: 'Bathrooms', value: property.bathrooms ?? '—' },
          { icon: Maximize2, label: 'Area', value: property.area ? `${property.area} sqft` : '—' },
          { icon: Car, label: 'Parking', value: property.parking ? `${property.parking} spots` : '—' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-blue-50 rounded-full p-2.5"><Icon size={20} className="text-blue-600" /></div>
            <span className="text-xl font-bold text-gray-900">{value}</span>
            <span className="text-xs font-medium text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Extra Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Property Details</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-sm">
          {[
            ['Type', property.type],
            ['Status', property.status === 'approved' ? 'Available' : property.status],
            ['City', property.city],
            ['Location', property.location],
            ['Available From', property.availableFrom ? new Date(property.availableFrom).toLocaleDateString('en-IN') : 'Immediate'],
            ['Utilities', property.utilitiesIncluded ? 'Included' : 'Not Included'],
          ].filter(([, v]) => v).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-gray-500">{k}</span>
              <span className="font-semibold text-gray-800 capitalize">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      {property.amenities?.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Amenities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {property.amenities.map((a) => {
              const Icon = getAmenityIcon(a);
              return (
                <div key={a} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
                  <div className="bg-blue-50 rounded-lg p-1.5 shrink-0">
                    <Icon size={16} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 capitalize">{a}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="w-full rounded-2xl overflow-hidden relative shadow-sm border border-gray-100 bg-blue-50" style={{ height: 300 }}>
        <img
          src="https://mt1.google.com/vt/lyrs=m&x=10&y=10&z=5"
          alt="Map"
          className="w-full h-full object-cover opacity-50 grayscale-[15%]"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative flex flex-col items-center">
            <div className="bg-pink-500/20 w-20 h-20 rounded-full animate-ping absolute" />
            <div className="bg-pink-500 w-5 h-5 rounded-full border-2 border-white shadow-lg relative z-10" />
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2">
          <MapPin size={16} className="text-blue-600" />
          <span className="text-sm font-semibold text-gray-800">{property.location}, {property.city}</span>
        </div>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-8">
      {/* Summary */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 flex items-center gap-6">
        <div className="text-center shrink-0">
          <div className="text-5xl font-black text-gray-900">{avgRating}</div>
          <StarDisplay value={Number(avgRating)} size={18} />
          <div className="text-xs text-gray-500 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => Math.round(r.rating) === star).length;
            const pct = reviews.length ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-4 text-gray-500 shrink-0">{star}</span>
                <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-amber-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-5">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write Review */}
      {user && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">
            {reviewSubmitted ? 'Update Your Review' : 'Write a Review'}
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Your Rating</p>
              <StarPicker value={reviewRating} onChange={setReviewRating} />
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your experience about this property..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none transition-all"
            />
            <button
              onClick={() => reviewMutation.mutate()}
              disabled={reviewRating === 0 || reviewMutation.isPending}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
            >
              {reviewMutation.isPending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : <Send size={14} />}
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* Review List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Star size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-600">No reviews yet</p>
          <p className="text-sm text-gray-400 mt-1">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                    {(r.buyerName || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{r.buyerName || 'Anonymous'}</p>
                    <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <StarDisplay value={r.rating} />
              </div>
              {r.comment && <p className="text-sm text-gray-600 leading-relaxed mt-2">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAbout = () => {
    const owner = property.owner;
    return (
      <div className="space-y-6">
        {/* Seller Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Listed By</h3>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg shadow-blue-200">
              {(owner?.companyName || owner?.contactName || 'S')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900">{owner?.companyName || 'Private Seller'}</h4>
              {owner?.contactName && <p className="text-sm text-gray-500 mt-0.5">{owner.contactName}</p>}
              <div className="flex items-center gap-1 mt-1">
                <StarDisplay value={owner?.rating || 4} size={13} />
                <span className="text-xs text-gray-500 ml-1">{owner?.rating || '4.0'} rating</span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2.5">
            {owner?.phone && (
              <a href={`tel:${owner.phone}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition-colors group">
                <div className="bg-blue-50 group-hover:bg-blue-100 rounded-lg p-2 transition-colors">
                  <Phone size={15} className="text-blue-600" />
                </div>
                {owner.phone}
              </a>
            )}
            {owner?.email && (
              <a href={`mailto:${owner.email}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition-colors group">
                <div className="bg-blue-50 group-hover:bg-blue-100 rounded-lg p-2 transition-colors">
                  <Mail size={15} className="text-blue-600" />
                </div>
                {owner.email}
              </a>
            )}
            {owner?.companyName && (
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="bg-blue-50 rounded-lg p-2">
                  <Building2 size={15} className="text-blue-600" />
                </div>
                {owner.companyName}
              </div>
            )}
          </div>
        </div>

        {/* Property Summary */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-5 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3">Property Highlights</h3>
          <ul className="space-y-2">
            {[
              `Listed on ${new Date(property.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`,
              property.deposit ? `Security deposit: ₹${property.deposit.toLocaleString('en-IN')}` : null,
              property.minLease ? `Minimum lease: ${property.minLease}` : null,
              property.utilitiesIncluded ? 'Utilities included in rent' : null,
            ].filter(Boolean).map((pt) => (
              <li key={pt} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle size={15} className="text-green-500 shrink-0" />
                {pt}
              </li>
            ))}
          </ul>
        </div>

        {/* Send Enquiry */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Send an Enquiry</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={enquiryName}
              onChange={(e) => setEnquiryName(e.target.value)}
              placeholder="Your name"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <textarea
              value={enquiryMsg}
              onChange={(e) => setEnquiryMsg(e.target.value)}
              placeholder="I'm interested in this property. Please get in touch with me..."
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none transition-all"
            />
            <button
              onClick={() => enquireMutation.mutate({ name: enquiryName, message: enquiryMsg })}
              disabled={enquireMutation.isPending || !enquiryName}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
            >
              {enquireMutation.isPending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : <Send size={16} />}
              Send Enquiry
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-16">
      <Navbar />

      {/* Lightbox */}
      {lightboxOpen && <Lightbox images={images} startIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />}

      {/* Tour Modal */}
      {showTourModal && (
        <TourModal
          property={property}
          onClose={() => setShowTourModal(false)}
          onSubmit={(payload) => tourMutation.mutate(payload)}
          isLoading={tourMutation.isPending}
        />
      )}

      <main className="max-w-[1440px] mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ─── LEFT COLUMN ─── */}
          <div className="flex-1 w-full min-w-0 space-y-7">

            {/* Image Gallery */}
            <div className="h-[420px] w-full flex gap-3">
              {/* Main Image */}
              <div
                className="w-1/2 md:w-3/5 h-full relative group overflow-hidden rounded-2xl cursor-zoom-in shadow-md"
                onClick={() => openLightbox(0)}
              >
                <img src={images[0]} alt={property.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <Maximize2 size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                </div>
              </div>

              {/* Mosaic */}
              <div className="flex-1 flex flex-col gap-3 h-full">
                <div className="h-1/2 flex gap-3 w-full">
                  {[1, 2].map((i) => (
                    <div key={i} className="w-1/2 h-full overflow-hidden rounded-2xl relative group cursor-zoom-in shadow-md" onClick={() => openLightbox(i)}>
                      <img src={images[i]} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                    </div>
                  ))}
                </div>
                <div className="h-1/2 w-full overflow-hidden rounded-2xl relative group cursor-zoom-in shadow-md" onClick={() => openLightbox(3)}>
                  <img src={images[3]} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                  {images.length > 4 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">+{images.length - 4} more</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wide">
                    {property.type}
                  </span>
                  <div className="flex items-center gap-1">
                    <StarDisplay value={Number(avgRating)} size={14} />
                    <span className="text-sm text-gray-500 font-medium">{avgRating} ({reviews.length})</span>
                  </div>
                </div>
                <h1 className="text-3xl font-black text-gray-900">{property.title}</h1>
                <div className="flex items-center gap-2 mt-2 text-gray-500">
                  <MapPin size={16} className="text-blue-500 shrink-0" />
                  <span className="text-sm">{property.location}, {property.city}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-3xl font-black text-gray-900">
                  ₹{property.price.toLocaleString('en-IN')}
                </div>
                {/* Favorite Button */}
                <button
                  onClick={() => favMutation.mutate()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm border transition-all ${
                    isFavorited
                      ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-400'
                  }`}
                >
                  <Heart size={16} className={isFavorited ? 'fill-red-500 text-red-500' : ''} />
                  {isFavorited ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex gap-8">
                {['Overview', 'Reviews', 'About'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-bold transition-all relative ${
                      activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                    {tab === 'Reviews' && reviews.length > 0 && (
                      <span className="ml-1.5 bg-blue-100 text-blue-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {reviews.length}
                      </span>
                    )}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'Overview' && renderOverview()}
              {activeTab === 'Reviews' && renderReviews()}
              {activeTab === 'About' && renderAbout()}
            </div>
          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div className="w-full lg:w-[340px] shrink-0 space-y-5">
            {/* Schedule Tour CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-5 text-white shadow-xl shadow-blue-200">
              <h3 className="text-lg font-bold mb-1">Interested in this property?</h3>
              {tourStatus?.hasPendingTour ? (
                <>
                  <p className="text-blue-100 text-sm mb-4">
                    {tourStatus.status === 'scheduled'
                      ? `Your tour is scheduled for ${new Date(tourStatus.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}`
                      : 'You already have a tour request pending approval.'}
                  </p>
                  <button
                    disabled
                    className="w-full py-3 bg-white/20 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed border border-white/20"
                  >
                    {tourStatus.status === 'scheduled' ? <CheckCircle size={16} /> : <Clock size={16} />}
                    {tourStatus.status === 'scheduled' ? 'Tour Scheduled' : 'Request Pending'}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-blue-100 text-sm mb-4">Request a video tour (A ₹500 fee will be charged once confirmed).</p>
                  <button
                    onClick={() => {
                      if (!user) return toast.error('Please log in to schedule a tour');
                      setShowTourModal(true);
                    }}
                    className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <Calendar size={16} />
                    Schedule a Tour
                  </button>
                </>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">Quick Info</h3>
              {[
                { label: 'Price', value: `₹${property.price.toLocaleString('en-IN')}` },
                { label: 'Type', value: property.type },
                { label: 'City', value: property.city },
                { label: 'Beds / Baths', value: `${property.bedrooms ?? '—'} / ${property.bathrooms ?? '—'}` },
                { label: 'Area', value: property.area ? `${property.area} sqft` : '—' },
                { label: 'Rating', value: `⭐ ${avgRating}/5 (${reviews.length} reviews)` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-gray-800 text-right max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>

            {/* Similar Properties */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Similar Places</h2>
              <div className="flex flex-col gap-4">
                {similarProperties.map((sp) => (
                  <PropertyCard
                    key={sp._id}
                    property={{
                      ...sp,
                      id: sp._id,
                      image: sp.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
                      location: `${sp.location}, ${sp.city}`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PropertyDetails;