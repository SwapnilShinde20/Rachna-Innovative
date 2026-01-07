import React from 'react';
import { 
  Shield, 
  FileText, 
  Home, 
  MapPin, 
  Navigation, 
  MessageSquare, 
  HelpCircle,
  Gavel,
  FolderOpen,
  ArrowRight,
  Hammer
} from 'lucide-react';
import Navbar from '../../components/buyer/Navbar';

// Importing your existing Navbar

// --- Components ---

// 1. Sidebar Component
const ServiceSidebar = () => {
  const menuItems = [
    { id: 1, label: 'Legal Support', icon: null, active: true }, // Active state has no icon in design, just text
    { id: 2, label: 'Property Law', icon: FileText, active: false },
    { id: 3, label: 'Contracts & Aggrements', icon: Home, active: false },
    { id: 4, label: 'Zoning & Permits', icon: MapPin, active: false },
    { id: 5, label: 'Navigation & Permits', icon: Navigation, active: false },
    { id: 6, label: 'Dispute Resolution', icon: MessageSquare, active: false },
    { id: 7, label: 'FAQs', icon: HelpCircle, active: false },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 hidden lg:block sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto shrink-0 py-6">
      <div className="px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-medium transition-colors ${
              item.active
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {item.icon && <item.icon size={18} className={item.active ? 'text-white' : 'text-gray-400'} />}
            {!item.icon && item.active && <span className="w-1" />} {/* Spacer if no icon for active */}
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
};

// 2. Action Card (Top Blue Cards)
const ActionCard = ({ title, icon: Icon, buttonText }) => (
  <div className="bg-blue-50/80 rounded-2xl p-8 flex flex-col items-start justify-between h-56 border border-blue-100">
    <div className="bg-white p-3 rounded-xl shadow-sm mb-4">
      <Icon size={28} className="text-blue-600" />
    </div>
    
    <div className="w-full">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors">
        {buttonText}
      </button>
    </div>
  </div>
);

// 3. Info Card (Bottom White Cards)
const InfoCard = ({ icon: Icon, title }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-blue-600">
      <Icon size={24} />
    </div>
    
    <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
    
    <div className="space-y-4">
      <p className="text-gray-500 text-sm leading-relaxed">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
      </p>
      
      <button className="text-blue-600 font-semibold text-sm hover:underline">
        Read More
      </button>

      <div className="border-t border-gray-100 pt-4">
         <p className="text-gray-500 text-sm leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        </p>
      </div>
    </div>
  </div>
);

// --- Main Page Component ---

const LegalServicesPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Navbar />

      <div className="flex max-w-[1600px] mx-auto">
        {/* Reuse the Left Sidebar Component */}
        <ServiceSidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-8 lg:p-12 bg-gray-50/30">
          {/* Header Section */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Legal Support Center</h1>
            <p className="text-xl text-gray-500 font-medium">Expert Guidance for Your Real Estate Journey</p>
          </div>

          {/* Top Grid: Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <ActionCard 
              title="Consult with a Lawyer" 
              icon={FileText} 
              buttonText="Schedule Consultation" 
            />
            <ActionCard 
              title="Legal Document Library" 
              icon={FolderOpen} 
              buttonText="Browse Documents" 
            />
          </div>

          {/* Bottom Grid: Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard 
              icon={Hammer} 
              title="Property Law Explained" 
            />
            <InfoCard 
              icon={FileText} 
              title="Understanding Contracts" 
            />
            <InfoCard 
              icon={FileText} 
              title="Legal Document Library" 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default LegalServicesPage;