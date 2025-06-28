import React from 'react';
import FeedbackForm from '../components/feedback/FeedbackForm';

const FeedbackPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <FeedbackForm />
      </div>
    </div>
  );
};

export default FeedbackPage; 