import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-items">
          <Link to="/" className="nav-brand">
            <span className="brand-text">FeeBo</span>
          </Link>
          
          <div className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/explore" className="nav-link">
              Explore
            </Link>
            <Link to="/feedback" className="nav-link">
              Share Feedback
            </Link>
            
            <div className="relative group">
              <button className="nav-link" aria-label="Contact">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <div className="contact-popup">
                <p className="text-sm text-gray-600">Contact us at:</p>
                <p className="text-sm text-blue-600 break-all">contact.feebo@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 