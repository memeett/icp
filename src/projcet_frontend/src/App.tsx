import React from 'react';
import { AppProviders } from './app/providers/AppProviders';
import { AppRouter } from './app/router';
import InboxPanel from './components/inbox/InboxPanel';
import './styles/style.css';

function App() {
  return (
    <AppProviders>
      <div className="App">
        <AppRouter />
        <InboxPanel />
      </div>
    </AppProviders>
  );
}

export default App;
