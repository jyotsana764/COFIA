import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import ShopContextProvider from './context/ShopContext.jsx';
import './index.css';

class AppErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('COFIA failed to render:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-2xl font-semibold">COFIA could not load this page</h1>
          <p className="text-gray-600">
            Refresh the page to try again. If the problem continues, check the browser console for details.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-black px-6 py-3 text-white"
          >
            Refresh page
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('COFIA could not start because the #root element is missing.');
}

createRoot(rootElement).render(
  <AppErrorBoundary>
    <BrowserRouter>
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </BrowserRouter>
  </AppErrorBoundary>,
);
