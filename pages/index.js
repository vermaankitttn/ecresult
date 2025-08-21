import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import CandidateCard from '../components/CandidateCard';
import Sidebar from '../components/Sidebar';
import DebugInfo from '../components/DebugInfo';

export default function Home() {
  const [activeTab, setActiveTab] = useState(0); // 0 for Top 10, 1 for Remaining
  const [lastSwitch, setLastSwitch] = useState(Date.now());
  const [refreshCount, setRefreshCount] = useState(0);
  const [candidatesData, setCandidatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Function to warm up image server connection
  const warmUpImageServer = async () => {
    try {
      console.log('🔥 Warming up image server connection...');
      
      // Try to load a test image to establish connection
      const testUrl = '/candidates/PRAVEEN_KUMAR_JHA.png';
      
      const response = await fetch(testUrl, { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        console.log('✅ Image server connection established');
      } else {
        console.log('⚠️ Image server responded but not ok');
      }
    } catch (error) {
      console.log('❌ Failed to connect to image server:', error.message);
    }
  };

  // Function to fetch data from Google Sheets
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching data from backend API...');
      
      // Fetch from Next.js API route
      const response = await fetch('/api/google-sheets-data');
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Data received:', data.length, 'candidates');
        setCandidatesData(data);
        setLastRefresh(new Date().toISOString());
      } else {
        throw new Error(`API responded with status ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setError(`Failed to load data from Google Sheets: ${error.message}`);
      // Use mock data as fallback
      setCandidatesData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const getMockData = () => {
    return [
      {
        id: 1,
        name: "VIPIN KUMAR SINGH",
        flat: "1725",
        totalCount: 14,
        totalValue: 25.41,
        votes: { "920": 0, "1005": 0, "1165": 0, "1285": 0, "1670": 14 },
        position: 1
      },
      {
        id: 2,
        name: "KAVITA GUPTA",
        flat: "2430",
        totalCount: 15,
        totalValue: 24.34,
        votes: { "920": 0, "1005": 4, "1165": 0, "1285": 0, "1670": 11 },
        position: 2
      }
    ];
  };

  // Initial data load and image server warm-up
  useEffect(() => {
    const initializeApp = async () => {
      // Warm up image server first
      await warmUpImageServer();
      
      // Then fetch data
      await fetchData();
    };
    
    initializeApp();
  }, []);

  // Auto-switch tabs every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => (prev + 1) % 2);
      setLastSwitch(Date.now());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Auto-refresh data every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCount(prev => prev + 1);
      fetchData(); // Fetch new data
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const top10Candidates = candidatesData.slice(0, 10);
  const remainingCandidates = candidatesData.slice(10);

  const timeSinceSwitch = Math.floor((Date.now() - lastSwitch) / 1000);
  const countdown = Math.max(0, 10 - timeSinceSwitch);

  return (
    <>
      <Head>
        <title>🏆 EC Results Live Dashboard 2025-2026</title>
        <meta name="description" content="Real-time election results dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="App">
        <header className="App-header">
          <div className="header-content">
            <img src="/logo.png" alt="SKA Metro Villé" className="header-logo" />
            <h1>🏆 EC Results Live Dashboard 2025-2026</h1>
          </div>
        </header>

        <div className={`dashboard-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Sidebar 
            activeTab={activeTab}
            countdown={countdown}
            refreshCount={refreshCount}
            totalCandidates={candidatesData.length}
            onTabChange={setActiveTab}
            loading={loading}
            error={error}
            lastRefresh={lastRefresh}
            onRefresh={fetchData}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={setSidebarCollapsed}
          />

          <main className="main-content">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner">⏳</div>
                <h2>Loading candidate data...</h2>
                <p>Fetching latest results from Google Sheets</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <div className="error-icon">❌</div>
                <h2>Error loading data</h2>
                <p>{error}</p>
                <button onClick={fetchData} className="retry-button">
                  🔄 Retry
                </button>
              </div>
            ) : (
              <>
                {activeTab === 0 ? (
                  <div className="tab-content">
                    <div className="tab-header top10">
                      🏆 TOP 10 LEADING CANDIDATES
                    </div>
                    <div className="candidates-grid">
                      {top10Candidates.length > 0 ? (
                        top10Candidates.map((candidate) => (
                          <CandidateCard 
                            key={candidate.id}
                            candidate={candidate}
                            isTop10={true}
                          />
                        ))
                      ) : (
                        <div className="no-candidates">
                          <h3>No candidates found</h3>
                          <p>No candidate data available</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="tab-content">
                    <div className="tab-header remaining">
                      TRAILING CANDIDATES - {remainingCandidates.length}
                    </div>
                    <div className="candidates-grid">
                      {remainingCandidates.length > 0 ? (
                        remainingCandidates.map((candidate) => (
                          <CandidateCard 
                            key={candidate.id}
                            candidate={candidate}
                            isTop10={false}
                          />
                        ))
                      ) : (
                        <div className="no-candidates">
                          <h3>No remaining candidates to display</h3>
                          <p>All candidates are in the top 10!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
      </div>
      <DebugInfo />
    </div>
    </>
  );
}