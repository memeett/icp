import React from 'react';
import { AppProviders } from './app/providers/AppProviders';
import { AppRouter } from './app/router';
import InboxPanel from './components/inbox/InboxPanel';
<<<<<<< HEAD
import AIAdvisor from './components/chat/AIAdvisor';
import GlobalLoadingOverlay from './shared/components/GlobalLoadingOverlay';
=======
>>>>>>> master
import './styles/style.css';

function App() {
  return (
    <AppProviders>
      <div className="App">
        <AppRouter />
        <InboxPanel />
<<<<<<< HEAD
        <AIAdvisor />
        <GlobalLoadingOverlay />
=======
>>>>>>> master
      </div>
    </AppProviders>
  );
}

export default App;
