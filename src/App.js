import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import PostComposer from './components/PostComposer/PostComposer';
import DraftManager from './components/DraftManager/DraftManager';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>📱 Social Post Manager</h1>
            <p className="subtitle">Manage posts across multiple platforms</p>
          </div>
        </header>

        <main className="app-main">
          <div className="composer-section">
            <PostComposer />
          </div>
          
          <div className="drafts-section">
            <DraftManager />
          </div>
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <p>Built with ❤️ using React + Redux Toolkit</p>
            <p className="footer-hint">
              💾 Drafts auto-saved to localStorage • 
              🔄 Mock API simulates backend
            </p>
          </div>
        </footer>
      </div>
    </Provider>
  );
}

export default App;