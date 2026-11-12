import React from 'react';
import { createRoot } from 'react-dom/client';
import { NavProvider, Navbar, useNav } from './nav';
import Home from './pages/Home';
import Cars from './pages/Cars';
import Dealers from './pages/Dealers';
import Manufacturers from './pages/Manufacturers';

function Routes() {
    const { path } = useNav();

    if (path === '/cars') {
        return <Cars />;
    }

    if (path === '/dealers') {
        return <Dealers />;
    }

    if (path === '/manufacturers') {
        return <Manufacturers />;
    }

    return <Home />;
}

function App() {
    return (
        <NavProvider>
            <div className="page-shell">
                <Navbar />
                <main className="page-wrap">
                    <Routes />
                </main>
            </div>
        </NavProvider>
    );
}

createRoot(document.getElementById('app')).render(<App />);
