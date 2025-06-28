import React from 'react';
import { Feedback } from '../../types/feedback';

interface FeedbackCardProps {
  feedback: Feedback;
  onClose: () => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Back button */}
        <button onClick={onClose} className="back-button">
          <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <div className="modal-body">
          {/* Title */}
          <h2 className="feedback-title">{feedback.title}</h2>

          {/* Categories */}
          <div className="category-tags">
            <span className="category-tag main-category">
              {feedback.category}
            </span>
            <span className="category-tag sub-category">
              {feedback.subCategory}
            </span>
          </div>

          {/* Description */}
          <div className="description-section">
            <h3 className="section-title">Description</h3>
            <p className="feedback-description">{feedback.description}</p>
          </div>

          {/* Date */}
          <div className="submission-date">
            Submitted on: {new Date(feedback.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard; 