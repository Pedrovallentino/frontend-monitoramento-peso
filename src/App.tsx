import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { GasStatusCard } from './components/GasStatusCard';
import { SwapHistoryTable } from './components/SwapHistoryTable';
import { WeightChart } from './components/WeightChart';
import { TechnicalPanel } from './components/TechnicalPanel';
import { Settings } from './components/Settings';
import { useGasStore } from './store/useGasStore';
import { api } from './services/api';
import type { DeviceStatus } from './services/api';
import { Menu, WifiOff } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [status, setStatus] = useState<DeviceStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [latency, setLatency] = useState(0);
  const { settings, updateSwapData, addReading } = useGasStore();

  useEffect(() => {
    const fetchData = async () => {
      const start = Date.now();
      try {
        const data = await api.getStatus();
        const end = Date.now();
        
        setStatus(data);
        setIsConnected(true);
        setLatency(end - start);
        
        // Update store with new data
        updateSwapData(data.gasSwapCount, data.weightKg);
        addReading(data.weightKg);
        
      } catch (error) {
        console.error("Failed to fetch status", error);
        setIsConnected(false);
      }
    };

    // Initial fetch
    fetchData();

    // Polling
    const interval = setInterval(fetchData, settings.updateInterval);
    return () => clearInterval(interval);
  }, [settings.updateInterval, updateSwapData, addReading]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GasStatusCard currentWeight={status?.weightKg ?? 0} />
              <div className="space-y-6">
                 {/* Mini Chart Preview */}
                 <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
                    <h4 className="text-sm font-semibold text-gray-500 mb-2">Resumo de Consumo</h4>
                    <div className="h-40">
                      <WeightChart />
                    </div>
                 </div>
                 {/* Last Activity */}
                 <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
                    <h4 className="text-sm font-semibold text-gray-500 mb-2">Última Atividade</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">Trocas Detectadas</span>
                      <span className="font-bold text-xl">{status?.gasSwapCount ?? 0}</span>
                    </div>
                 </div>
              </div>
            </div>
            <SwapHistoryTable />
          </div>
        );
      case 'history':
        return <SwapHistoryTable />;
      case 'charts':
        return <WeightChart />;
      case 'technical':
        return (
          <TechnicalPanel 
            rawData={status} 
            latencyMs={latency} 
            isConnected={isConnected}
            lastUpdateTimestamp={status?.lastUpdate ?? 0}
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-6 z-10">
          <button 
            className="md:hidden text-gray-600 dark:text-gray-300"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <h2 className="text-lg font-semibold text-gray-800 dark:text-white ml-4 md:ml-0 capitalize">
            {activeTab}
          </h2>

          <div className="flex items-center gap-4">
            {!isConnected && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium animate-pulse">
                <WifiOff size={14} />
                <span>Desconectado</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {isConnected ? 'Sistema Online' : 'Sistema Offline'}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
