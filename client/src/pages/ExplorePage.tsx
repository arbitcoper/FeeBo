import React, { useState, useEffect } from 'react';
import FeedbackCard from '../components/feedback/FeedbackCard';
import { CATEGORIES, Feedback } from '../types/feedback';

const API_URL = 'http://localhost:5000/api/feedback';

const ExplorePage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch feedbacks');
      }
      const data = await response.json();
      setFeedbacks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setError('Failed to load feedbacks. Please try again later.');
      setLoading(false);
    }
  };

  // Get available subcategories based on selected main category
  const availableSubCategories = selectedMainCategory === 'All'
    ? []
    : CATEGORIES.find(cat => cat.name === selectedMainCategory)?.subCategories || [];

  // Filter feedbacks based on selected categories
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesMainCategory = selectedMainCategory === 'All' || feedback.category === selectedMainCategory;
    const matchesSubCategory = selectedSubCategory === 'All' || feedback.subCategory === selectedSubCategory;
    const searchLower = searchQuery.toLowerCase();
    return matchesMainCategory && matchesSubCategory && (
      feedback.title.toLowerCase().includes(searchLower) ||
      feedback.description.toLowerCase().includes(searchLower) ||
      feedback.category.toLowerCase().includes(searchLower) ||
      feedback.subCategory.toLowerCase().includes(searchLower)
    );
  });

  // Handle main category change
  const handleMainCategoryChange = (category: string) => {
    setSelectedMainCategory(category);
    setSelectedSubCategory('All'); // Reset subcategory when main category changes
  };

  const truncateText = (text: string, lines: number = 2) => {
    const lineHeight = 20; // Approximate line height in pixels
    return (
      <div 
        className="overflow-hidden" 
        style={{ 
          display: '-webkit-box',
          WebkitLineClamp: lines,
          WebkitBoxOrient: 'vertical',
          maxHeight: `${lineHeight * lines}px`
        }}
      >
        {text}
      </div>
    );
  };

  return (
    <div className="page-container">
      <h2 className="section-title">Explore Feedbacks</h2>

      {/* Search and Filters Row */}
      <div className="filter-section">
        {/* Category Filter */}
        <div className="filter-group">
          <select
            value={selectedMainCategory}
            onChange={(e) => handleMainCategoryChange(e.target.value)}
            className="input-field"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sub Category Filter */}
        <div className="filter-group">
          <select
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            className="input-field"
            disabled={selectedMainCategory === 'All'}
          >
            <option value="All">All Sub Categories</option>
            {availableSubCategories.map((subCat) => (
              <option key={subCat.name} value={subCat.name}>
                {subCat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Box */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search feedbacks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <svg
            className="search-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Active Filters */}
      <div className="active-filters">
        {searchQuery && (
          <span className="filter-tag">
            Search: {searchQuery}
            <button
              onClick={() => setSearchQuery('')}
              className="filter-remove"
            >
              ×
            </button>
          </span>
        )}
        {selectedMainCategory !== 'All' && (
          <span className="filter-tag main-category">
            Category: {selectedMainCategory}
            <button
              onClick={() => handleMainCategoryChange('All')}
              className="filter-remove"
            >
              ×
            </button>
          </span>
        )}
        {selectedSubCategory !== 'All' && (
          <span className="filter-tag sub-category">
            Sub Category: {selectedSubCategory}
            <button
              onClick={() => setSelectedSubCategory('All')}
              className="filter-remove"
            >
              ×
            </button>
          </span>
        )}
      </div>

      {/* Feedback List */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading feedbacks...</p>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="empty-state">
          {searchQuery || selectedMainCategory !== 'All' || selectedSubCategory !== 'All'
            ? 'No feedbacks found matching your filters.'
            : 'No feedbacks yet.'}
        </div>
      ) : (
        <div className="feedback-grid">
          {filteredFeedbacks.map((feedback) => (
            <div
              key={feedback._id}
              onClick={() => setSelectedFeedback(feedback)}
              className="feedback-card"
            >
              <h3 className="feedback-title">{feedback.title}</h3>
              
              <div className="category-tags">
                <span className="category-tag main-category">
                  {feedback.category}
                </span>
                <span className="category-tag sub-category">
                  {feedback.subCategory}
                </span>
              </div>

              <div className="feedback-description">
                {truncateText(feedback.description)}
              </div>

              <div className="feedback-date">
                {new Date(feedback.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Card Modal */}
      {selectedFeedback && (
        <FeedbackCard
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
        />
      )}
    </div>
  );
};

export default ExplorePage; 