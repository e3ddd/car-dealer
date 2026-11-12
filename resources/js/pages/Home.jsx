import React from 'react';
import { useNav } from '../nav';

export default function Home() {
    const { navigate } = useNav();

    function goToCars() {
        navigate('/cars');
    }

    function goToDealers() {
        navigate('/dealers');
    }

    function goToManufacturers() {
        navigate('/manufacturers');
    }

    return (
        <section className="hero-panel">
            <div className="hero-copy">
                <h1 className="display-title">Car Dealer</h1>
                <p className="lede">
                    Browse cars, dealers, and manufacturers in one place. Keep the list tidy, edit records quickly, and remove what you no longer need.
                </p>
                <div className="cta-row">
                    <button type="button" className="btn btn-primary" onClick={goToCars}>
                        All cars
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={goToDealers}>
                        All dealers
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={goToManufacturers}>
                        All manufacturers
                    </button>
                </div>
            </div>
        </section>
    );
}
