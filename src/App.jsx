import React, { useState } from 'react';
import { RefreshCw, AlertCircle, BarChart3, TrendingUp, Users, Eye } from 'lucide-react';
import { useRecruitmentData } from './apiService';
import CombinedDashboard from './CombinedDashboard';
import OneViewDashboard from './OneViewDashboard';
import RecruitmentFunnel from './RecruitmentFunnel';
import StageWiseAnalysis from './StageWiseAnalysis';

const App = () => {
  const { data, loading, error, refetch } = useRecruitmentData();
  const [activeTab, setActiveTab] = useState('oneview');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading recruitment data...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch the latest data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-center mb-2 text-gray-900">Error Loading Data</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={refetch}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 text-gray-900">No Data Available</h2>
          <p className="text-gray-600 mb-4">No recruitment data found. Please check your data source.</p>
          <button
            onClick={refetch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-md sticky top-0 z-40 border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2">
                <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-base md:text-xl font-black text-gray-900 truncate">Recruitment Analytics Platform</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Comprehensive dashboard, funnel analysis & stage-wise insights</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-xs font-semibold text-gray-700">{data.length} Candidates</span>
              </div>
              <button
                onClick={refetch}
                className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 text-sm font-semibold shadow-md transition-all flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b-2 border-gray-200 shadow-sm sticky top-[60px] md:top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-3 md:px-6">
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('oneview')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'oneview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Eye className="h-4 w-4" />
              One View
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard & Analytics
            </button>
            <button
              onClick={() => setActiveTab('funnel')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'funnel'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Recruitment Funnel
            </button>
            <button
              onClick={() => setActiveTab('stagewise')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'stagewise'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="h-4 w-4" />
              Stage-wise Analysis
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6">
        {activeTab === 'dashboard' && <CombinedDashboard data={data} />}
        {activeTab === 'oneview' && <OneViewDashboard data={data} />}
        {activeTab === 'funnel' && <RecruitmentFunnel data={data} />}
        {activeTab === 'stagewise' && <StageWiseAnalysis data={data} />}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <p>Recruitment Analytics Platform v2.0</p>
              <p className="text-xs text-gray-500 mt-1">Real-time data synchronization • Stage-wise deep analysis enabled</p>
            </div>
            <div className="text-right">
              <p>Last updated: {new Date().toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">
                {data.length} candidates • {new Set(data.map(d => d.platform).filter(Boolean)).size} platforms • 16 funnel stages
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;