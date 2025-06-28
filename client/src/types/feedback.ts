export interface Feedback {
  _id: string;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export const CATEGORIES = [
  {
    name: "Electronics & Gadgets",
    subCategories: [
      { name: "Mobile Phones" },
      { name: "Laptops" },
      { name: "Tablets" },
      { name: "Wearables" },
      { name: "Audio Devices" }
    ]
  },
  {
    name: "Reading & Learning",
    subCategories: [
      { name: "Books" },
      { name: "Online Courses" },
      { name: "Tutorials" },
      { name: "Documentation" },
      { name: "Learning Platforms" }
    ]
  },
  {
    name: "Entertainment",
    subCategories: [
      { name: "Movies" },
      { name: "Web Series" },
      { name: "TV Shows" },
      { name: "Music" },
      { name: "Games" }
    ]
  },
  {
    name: "Tools & Apps",
    subCategories: [
      { name: "Mobile Apps" },
      { name: "Desktop Software" },
      { name: "Web Apps" },
      { name: "AI Tools" },
      { name: "Browser Extensions" }
    ]
  },
  {
    name: "General Suggestions",
    subCategories: [
      { name: "Website Feedback" },
      { name: "Service Feedback" },
      { name: "Feature Requests" },
      { name: "Bug Reports" },
      { name: "Other" }
    ]
  }
]; 