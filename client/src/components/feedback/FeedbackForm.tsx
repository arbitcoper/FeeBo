import { useState, FormEvent } from 'react';
import { CATEGORIES } from '../../types/feedback';

const API_URL = 'http://localhost:5000/api/feedback';

const FeedbackForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState(CATEGORIES[0].name);
  const [selectedSubCategory, setSelectedSubCategory] = useState(CATEGORIES[0].subCategories[0].name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the current category object based on selection
  const currentCategory = CATEGORIES.find(cat => cat.name === selectedMainCategory);

  const handleMainCategoryChange = (categoryName: string) => {
    setSelectedMainCategory(categoryName);
    // Reset subcategory to first option of new main category
    const category = CATEGORIES.find(cat => cat.name === categoryName);
    if (category) {
      setSelectedSubCategory(category.subCategories[0].name);
    }
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setSelectedMainCategory(CATEGORIES[0].name);
    setSelectedSubCategory(CATEGORIES[0].subCategories[0].name);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Client-side validation
    if (title.length < 3) {
      setError('Title must be at least 3 characters long');
      setIsSubmitting(false);
      return;
    }

    if (description.length < 10) {
      setError('Description must be at least 10 characters long');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          category: selectedMainCategory,
          subCategory: selectedSubCategory
        }),
      });

      const data = await response.json();

      if (response.ok) {
        clearForm();
        alert('Feedback submitted successfully!');
        // Optionally, you can trigger a refresh of the feedback list
        window.location.reload();
      } else {
        setError(data.message || 'Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Submit Feedback</h2>
      
      {error && (
        <div className="form-error">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="mainCategory" className="input-label">
              Main Category
            </label>
            <select
              id="mainCategory"
              value={selectedMainCategory}
              onChange={(e) => handleMainCategoryChange(e.target.value)}
              className="input-field"
              disabled={isSubmitting}
            >
              {CATEGORIES.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="subCategory" className="input-label">
              Sub Category
            </label>
            <select
              id="subCategory"
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className="input-field"
              disabled={isSubmitting}
            >
              {currentCategory?.subCategories.map((subCat) => (
                <option key={subCat.name} value={subCat.name}>
                  {subCat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="title" className="input-label">
            Title <span className="text-xs text-gray-500">(min. 3 characters)</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={3}
            maxLength={100}
            className="input-field"
            placeholder="Brief summary of your feedback"
            disabled={isSubmitting}
          />
          <p className="char-count">{title.length}/100 characters</p>
        </div>

        <div className="input-group">
          <label htmlFor="description" className="input-label">
            Description <span className="text-xs text-gray-500">(min. 10 characters)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={10}
            rows={4}
            className="input-field"
            placeholder="Detailed description of your feedback"
            disabled={isSubmitting}
          />
          <p className="char-count">{description.length} characters</p>
        </div>

        <button
          type="submit"
          className={`submit-button ${isSubmitting ? 'submit-button-disabled' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm; 