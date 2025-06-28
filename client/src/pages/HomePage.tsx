import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="hero-section h-screen">
        <div className="hero-content h-full flex items-center">
          <div className="hero-text-center w-full">
            <h1 className="hero-title">
              <span className="block">Welcome to </span>
              <span className="block text-blue-600">FeeBo</span>
            </h1>
            <p className="hero-description">
              Share your feedback and help shape the future. Browse feedback by category and contribute your ideas.
            </p>
            <div className="hero-buttons">
              <div className="rounded-md shadow">
                <Link to="/feedback" className="primary-button">
                  Share Feedback
                </Link>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Link to="/explore" className="secondary-button">
                  Browse Feedbacks
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 