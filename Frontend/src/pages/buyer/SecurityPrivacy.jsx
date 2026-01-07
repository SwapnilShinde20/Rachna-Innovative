import React from 'react';
import { 
  Shield, 
  Lock, 
  FileText, 
  User, 
  Search, 
  AlertCircle, 
  HelpCircle,
  FileCheck,
  Target,
  UserCheck
} from 'lucide-react';
import Navbar from '../../components/buyer/Navbar';


// --- Components ---

// 1. Sidebar Component (Customized for Security Page)
const SecuritySidebar = () => {
  const menuItems = [
    { id: 1, label: 'Security & Privacy', icon: null, active: true }, // Active state
    { id: 2, label: 'Data Protection', icon: FileText, active: false },
    { id: 3, label: 'Secure Transactions', icon: Target, active: false },
    { id: 4, label: 'Security With Service', icon: Shield, active: false },
    { id: 5, label: 'Terms of Service', icon: FileCheck, active: false },
    { id: 6, label: 'Report an issue', icon: AlertCircle, active: false },
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
            {!item.icon && item.active && <span className="w-1" />} {/* Spacer alignment */}
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
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
    <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-blue-600 shrink-0">
      <Icon size={24} />
    </div>
    
    <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
    
    <div className="space-y-4 flex-1 flex flex-col">
      <p className="text-gray-500 text-sm leading-relaxed">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
      </p>
      
      <button className="text-blue-600 font-semibold text-sm hover:underline text-left">
        Read More
      </button>

      <div className="border-t border-gray-100 pt-4 mt-auto">
         <p className="text-gray-500 text-sm leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        </p>
      </div>
    </div>
  </div>
);

// --- Main Page Component ---

const SecurityPrivacyPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Navbar />

      <div className="flex max-w-[1600px] mx-auto">
        {/* Sidebar */}
        <SecuritySidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-8 lg:p-12 bg-gray-50/30">
          
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Security & Privacy Policy</h1>
            <p className="text-xl text-gray-500 font-medium">Protecting Your Information</p>
          </div>

          {/* Top Grid: Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <ActionCard 
              title="Secure Transactions" 
              icon={Lock} 
              buttonText="Learn About Encryption" 
            />
            <ActionCard 
              title="Privacy Policy" 
              icon={Shield} 
              buttonText="Read Full Policy" 
            />
          </div>

          {/* Bottom Grid: Info Cards (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard 
              icon={Lock} 
              title="Data Encryption" 
            />
            <InfoCard 
              icon={Shield} 
              title="Data Encryption" 
            />
            <InfoCard 
              icon={FileText} 
              title="Privacy Policy" 
            />
             <InfoCard 
              icon={Shield} 
              title="Account Protection" 
            />
            <InfoCard 
              icon={UserCheck} 
              title="Account Protection" 
            />
            <InfoCard 
              icon={Search} 
              title="Fraud Protection" 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SecurityPrivacyPage;