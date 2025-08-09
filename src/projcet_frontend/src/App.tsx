import React from 'react';
import { AppProviders } from './app/providers/AppProviders';
import { AppRouter } from './app/router';
import { NotificationContainer } from './ui/components/NotificationContainer';
import './styles/style.css';

function App() {
  return (
    <AppProviders>
      <div className="App">
        <AppRouter />
        <NotificationContainer />
      </div>
    </AppProviders>
  );
}

export default App;
