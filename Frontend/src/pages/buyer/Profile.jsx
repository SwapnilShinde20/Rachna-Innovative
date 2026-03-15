import React, { useState, useRef } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useMutation } from '@tanstack/react-query';
import api from '../../lib/api';
import Navbar from '../../components/buyer/Navbar';
import { User, Mail, Shield, Save, Loader2, CheckCircle, Camera, X, Phone, Edit3 } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile({ hideNavbar = false }) {
  const { user, initialize } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isEditing, setIsEditing] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState(user?.profileImage || '');
  const fileInputRef = useRef(null);

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.put('/users/profile', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
      setIsEditing(false);
      initialize();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate({ name, phone, profileImage: tempPhotoUrl });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempPhotoUrl(reader.result);
        // Automatically save when photo is changed if in edit mode, or just set it
        if (!isEditing) {
           updateProfileMutation.mutate({ name, phone, profileImage: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-inter">
      {!hideNavbar && <Navbar />}
      
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12">
        <div className="bg-white rounded-[40px] shadow-[0_20px_60px_rgb(0,0,0,0.03)] border border-neutral-100 overflow-hidden relative">
          
          {/* Edit Icon in Top Right */}
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute top-8 right-8 z-20 p-3 bg-white hover:bg-neutral-50 text-neutral-400 hover:text-brandBlue-600 rounded-2xl border border-neutral-100 shadow-sm transition-all active:scale-90"
              title="Edit Profile"
            >
              <Edit3 size={20} />
            </button>
          )}

          {/* Light Theme Header */}
          <div className="bg-gradient-to-br from-brandBlue-50/50 via-white to-blue-50/20 px-8 pt-16 pb-20 text-center relative border-b border-neutral-100/50">
            <div className="relative z-10 flex flex-col items-center">
               
               {/* Profile Photo with Upload Trigger */}
               <div className="relative group mb-8">
                 <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center border-[6px] border-white shadow-2xl overflow-hidden ring-1 ring-neutral-200/50 transition-transform duration-500 group-hover:scale-[1.03]">
                    {tempPhotoUrl ? (
                      <img src={tempPhotoUrl} alt={user?.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={64} className="text-neutral-200" />
                    )}
                 </div>
                 <button 
                  onClick={triggerFileSelect}
                  className="absolute bottom-1 right-1 bg-brandBlue-600 text-white p-3 rounded-full shadow-xl hover:bg-brandBlue-700 transition-all hover:scale-110 active:scale-95 border-2 border-white"
                  title="Upload New Photo"
                 >
                    <Camera size={18} />
                 </button>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleFileChange} 
                   className="hidden" 
                   accept="image/*"
                 />
               </div>

               <div>
                  <h1 className="text-3xl font-black text-neutral-900 tracking-tight">{user?.name || 'Your Name'}</h1>
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <span className="px-4 py-1.5 bg-brandBlue-100/40 text-brandBlue-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-brandBlue-200/20">
                      {user?.role} ACCOUNT
                    </span>
                    <span className="px-4 py-1.5 bg-emerald-100/40 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-200/20 flex items-center gap-1.5">
                      <CheckCircle size={12} />
                      VERIFIED
                    </span>
                  </div>
               </div>
            </div>

            {/* Aesthetic Background Accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-brandBlue-400/5 rounded-full -mr-40 -mt-40 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          </div>

          <div className="p-8 sm:p-14">
             <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 gap-8">
                   {/* Name Field */}
                   <div>
                      <label className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.25em] block mb-3.5 ml-1">Full Name</label>
                      <div className="relative">
                         <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" />
                         <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing}
                        className={`w-full pl-14 pr-7 py-4.5 rounded-[22px] border transition-all outline-none font-semibold ${
                          isEditing 
                          ? 'border-brandBlue-500 bg-white ring-[6px] ring-brandBlue-50 text-neutral-900 shadow-sm' 
                          : 'border-neutral-50 bg-neutral-50/20 text-neutral-500 cursor-default'
                        }`}
                        placeholder="Enter your full name"
                      />
                      </div>
                   </div>

                   {/* Phone Field */}
                   <div>
                      <label className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.25em] block mb-3.5 ml-1">Business Mobile No</label>
                      <div className="relative">
                         <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" />
                         <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={!isEditing}
                        className={`w-full pl-14 pr-7 py-4.5 rounded-[22px] border transition-all outline-none font-semibold ${
                          isEditing 
                          ? 'border-brandBlue-500 bg-white ring-[6px] ring-brandBlue-50 text-neutral-900 shadow-sm' 
                          : 'border-neutral-50 bg-neutral-50/20 text-neutral-500 cursor-default'
                        }`}
                        placeholder="+91 XXXXX XXXXX"
                      />
                      </div>
                   </div>

                   {/* Email Field (Static) */}
                   <div>
                      <label className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.25em] block mb-3.5 ml-1">Email Address</label>
                      <div className="relative">
                         <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" />
                         <input 
                        type="email" 
                        value={user?.email}
                        disabled
                        className="w-full pl-14 pr-7 py-4.5 rounded-[22px] border border-neutral-50 bg-neutral-50/10 text-neutral-400 cursor-not-allowed font-semibold shadow-none"
                      />
                      </div>
                      <p className="mt-4 text-[11px] text-neutral-400 leading-relaxed ml-1 flex items-center gap-2">
                        <Shield size={12} />
                        Security locked: Email cannot be changed.
                      </p>
                   </div>
                </div>

                {isEditing && (
                  <div className="pt-10 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setName(user?.name || '');
                          setPhone(user?.phone || '');
                          setTempPhotoUrl(user?.profileImage || '');
                        }}
                        className="w-full sm:flex-1 bg-white border border-neutral-200 text-neutral-600 py-4 px-8 rounded-2xl font-bold hover:bg-neutral-50 transition-all active:scale-[0.98] outline-none"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="w-full sm:flex-2 bg-brandBlue-600 text-white py-4 px-8 rounded-2xl font-bold hover:bg-brandBlue-700 transition-all shadow-xl shadow-brandBlue-200/50 flex items-center justify-center gap-2 active:scale-[0.98] outline-none"
                    >
                        {updateProfileMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Save Profile
                    </button>
                  </div>
                )}
             </form>

             <div className="mt-16 p-8 bg-gradient-to-r from-brandBlue-50/40 to-white rounded-[32px] border border-brandBlue-100/50 flex items-start gap-6 shadow-sm">
                <div className="bg-white p-3.5 rounded-2xl text-brandBlue-600 shadow-sm shrink-0 border border-brandBlue-100">
                  <CheckCircle size={26} />
                </div>
                <div>
                   <h3 className="font-extrabold text-brandBlue-900 tracking-tight">Active Member</h3>
                   <p className="text-sm text-brandBlue-700/70 mt-2 leading-relaxed font-medium">
                     Joined in {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}. 
                     Your profile is 100% verified and optimized for premium property tours.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
