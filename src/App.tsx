// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import { AudioProvider, useAudio } from './contexts/AudioContext';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import SamplePage from './pages/SamplePage';
import ProcessingPage from './pages/ProcessingPage';
import ChatPage from './pages/ChatPage';

const AppContent: React.FC = () => {
  const { isProcessing, processingResult } = useAudio();

  const getProcessingStatus = () => {
    if (isProcessing) return 'processing';
    if (processingResult?.isComplete) return 'ready';
    return 'idle';
  };

  return (
    <Router>
      <Navbar processingStatus={getProcessingStatus()} />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/samples" element={<SamplePage />} />
          <Route path="/processing" element={<ProcessingPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </main>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle theme={theme}/>
      <AudioProvider>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          background: theme.colors.background 
        }}>
          <AppContent />
        </div>
      </AudioProvider>
    </ThemeProvider>
  );
};

export default App;