import React from 'react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-divider">
                <div className="constellation-line" />
            </div>

            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-brand-section">
                        <div className="footer-brand">
                            <h3> CosmicWatch</h3>
                            <p>Your Sentinel of Near-Earth Space.</p>
                        </div>
                        <div className="newsletter-signup">
                            <p className="newsletter-title">Join the Watch</p>
                            <div className="newsletter-input-group">
                                <input type="email" placeholder="Enter your email" />
                                <button type="button">Subscribe</button>
                            </div>
                        </div>
                    </div>

                    <div className="footer-links-grid">
                        <div className="footer-section">
                            <h4>Platform</h4>
                            <ul>
                                <li><a href="/dashboard">Dashboard</a></li>
                                <li><a href="/explore">Explorer</a></li>
                                <li><a href="#alerts">Alerts</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4>Data Sources</h4>
                            <ul>
                                <li><a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer">NASA API</a></li>
                                <li><a href="https://cneos.jpl.nasa.gov/" target="_blank" rel="noopener noreferrer">CNEOS</a></li>
                                <li><a href="https://www.jpl.nasa.gov/asteroid-watch" target="_blank" rel="noopener noreferrer">Asteroid Watch</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4>Legal</h4>
                            <ul>
                                <li><a href="#privacy">Privacy Policy</a></li>
                                <li><a href="#terms">Terms of Service</a></li>
                                <li><a href="#cookies">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-socials">
                        <a href="#" aria-label="GitHub">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                        </a>
                        <a href="#" aria-label="Twitter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                        </a>
                        <a href="#" aria-label="Discord">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2H3a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path><path d="M10.5 13.5l-1.5 2 2 2.5"></path><path d="M14.5 13.5l1.5 2-2 2.5"></path></svg>
                        </a>
                    </div>
                    <p className="footer-copyright">© {currentYear} CosmicWatch. Data powered by NASA NeoWs API.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
