import React, { createContext, useContext, useEffect, useState } from 'react';

const NavContext = createContext(null);

export function NavProvider({ children }) {
    const [path, setPath] = useState(window.location.pathname);

    useEffect(() => {
        function onPopState() {
            setPath(window.location.pathname);
        }

        window.addEventListener('popstate', onPopState);

        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    function navigate(to) {
        window.history.pushState({}, '', to);
        setPath(to);
    }

    return <NavContext.Provider value={{ path, navigate }}>{children}</NavContext.Provider>;
}

export function useNav() {
    return useContext(NavContext);
}

export function Link({ to, children, className = '' }) {
    const { path, navigate } = useNav();
    const isActive = path === to;

    function handleClick(event) {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        event.preventDefault();
        navigate(to);
    }

    return (
        <a
            href={to}
            className={`${className} ${isActive ? 'nav-link-active' : 'nav-link'}`}
            onClick={handleClick}
        >
            {children}
        </a>
    );
}

export function Navbar() {
    return (
        <nav className="nav-bar">
            <div className="nav-inner">
                <Link to="/" className="nav-brand">
                    Car Dealer
                </Link>
                <div className="nav-links">
                    <Link to="/cars">All cars</Link>
                    <Link to="/dealers">All dealers</Link>
                    <Link to="/manufacturers">All manufacturers</Link>
                </div>
            </div>
        </nav>
    );
}
