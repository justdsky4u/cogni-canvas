import { useState } from 'react';
import { 
  Brain, 
  BarChart3, 
  MessageSquare, 
  Zap, 
  Upload as UploadIcon, 
  Settings, 
  Search, 
  User,
  Menu,
  X
} from 'lucide-react';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisResult } from '@/lib/data-utils';
import { UploadZone } from '@/components/DataBrain/UploadZone';
import { IntelligenceDashboard } from '@/components/DataBrain/IntelligenceDashboard';
import { StrategyBoard } from '@/components/DataBrain/StrategyBoard';
import { DataChat } from '@/components/DataBrain/DataChat';
import { Button } from '@/components/ui/button';

function App() {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'dashboard' | 'strategy' | 'chat'>('upload');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleDataLoaded = (result: AnalysisResult) => {
    setData(result);
    setActiveTab('dashboard');
  };

  const navItems = [
    { id: 'upload', icon: <UploadIcon className="w-5 h-5" />, label: 'Ingestion' },
    { id: 'dashboard', icon: <BarChart3 className="w-5 h-5" />, label: 'Neural Insights', disabled: !data },
    { id: 'strategy', icon: <Zap className="w-5 h-5" />, label: 'Command Strategy', disabled: !data },
    { id: 'chat', icon: <MessageSquare className="w-5 h-5" />, label: 'Neural Chat', disabled: !data },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-purple-500/30">
      <Toaster position="top-center" theme="dark" richColors />
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-zinc-900/40 backdrop-blur-xl border-r border-zinc-800/50 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl shadow-lg shadow-purple-500/20">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">DATA BRAIN</span>
          </div>

          <nav className="flex-grow space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                disabled={item.disabled}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-lg shadow-purple-500/5' 
                    : item.disabled ? 'opacity-30 cursor-not-allowed' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {activeTab === item.id && <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-zinc-800/50 space-y-4">
            <button className="flex items-center gap-4 px-4 py-2 text-zinc-500 hover:text-zinc-200 transition-colors">
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Neural Config</span>
            </button>
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <User className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="flex-grow overflow-hidden">
                <p className="text-sm font-bold truncate">Elite Analyst</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Enterprise Tier</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'lg:pl-72' : ''}`}>
        <header className="sticky top-0 z-40 h-16 border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-zinc-400">
              <Menu />
            </Button>
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full text-zinc-400 text-sm">
              <Search className="w-4 h-4" />
              <span>Search intelligence nodes...</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <Button variant="ghost" className="text-zinc-400 text-sm">Documentation</Button>
             <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 rounded-full text-xs font-bold px-6">UPGRADE</Button>
          </div>
        </header>

        <div className="relative">
           {/* Content Grid Background Effect */}
           <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
             <div className="absolute top-0 left-0 w-full h-[700px] bg-gradient-to-b from-purple-500/30 via-cyan-500/10 to-transparent blur-[120px]" />
             <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px]" />
           </div>

           <div className="relative z-10 min-h-[calc(100-4rem)]">
             <AnimatePresence mode="wait">
               {activeTab === 'upload' && (
                 <UploadZone onDataLoaded={handleDataLoaded} />
               )}
               {activeTab === 'dashboard' && data && (
                 <IntelligenceDashboard data={data} />
               )}
               {activeTab === 'strategy' && data && (
                 <StrategyBoard data={data} />
               )}
               {activeTab === 'chat' && data && (
                 <div className="p-8 max-w-4xl mx-auto">
                    <DataChat data={data} />
                 </div>
               )}
             </AnimatePresence>
           </div>
        </div>
      </main>
    </div>
  );
}

export default App;
