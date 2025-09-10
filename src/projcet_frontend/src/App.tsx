import React from 'react';
import { AppProviders } from './app/providers/AppProviders';
import { AppRouter } from './app/router';
import InboxPanel from './components/inbox/InboxPanel';
<<<<<<< HEAD
=======
import AIAdvisor from './components/chat/AIAdvisor';
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
import './styles/style.css';

function App() {
  return (
    <AppProviders>
      <div className="App">
        <AppRouter />
        <InboxPanel />
<<<<<<< HEAD
=======
        <AIAdvisor />
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
      </div>
    </AppProviders>
  );
}

export default App;
