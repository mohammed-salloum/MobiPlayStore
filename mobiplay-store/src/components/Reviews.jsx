import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function Reviews() {
  const { darkMode } = useContext(ThemeContext); // جلب حالة الوضع الداكن من السياق

  // بيانات المراجعات
  const testimonials = [
    {
      id: 1,
      name: 'Mohammed Salloum',
      feedback: 'Great service and fast delivery! Highly recommend.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Emad Salloum',
      feedback: 'Very easy to use platform and excellent support.',
      rating: 4,
    },
    {
      id: 3,
      name: 'Mike Johnson',
      feedback: 'Amazing offers and perfect for mobile gamers.',
      rating: 4.5,
    },
    {
      id: 4,
      name: 'Sarah Williams',
      feedback: 'Fast response and smooth purchase experience.',
      rating: 5,
    },
  ];

  // دالة لرسم النجوم حسب التقييم
  const renderStars = (rating) => {
    const starColor = darkMode ? '#bb86fc' : '#0d6efd';
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(
          <span key={i} style={{ color: starColor }}>★</span>
        );
      } else if (rating >= i - 0.5) {
        stars.push(
          <span key={i} style={{ color: starColor }}>☆</span>
        );
      } else {
        stars.push(
          <span key={i} style={{ color: starColor }}>☆</span>
        );
      }
    }

    return stars;
  };

  return (
    <div className="container mt-5 mb-5 px-3" style={{ maxWidth: '900px' }}>
      <h2 className="mb-4 text-center fw-bold" style={{ letterSpacing: '1px' }}>
        Customer Testimonials
      </h2>

      {/* شبكة المراجعات */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {testimonials.map(({ id, name, feedback, rating }) => (
          <div
            key={id}
            className="p-4 rounded shadow-sm"
            style={{
              backgroundColor: darkMode ? '#2e1a47' : '#f8f9fa',
              color: darkMode ? '#d1c4e9' : '#212529',
              boxShadow: darkMode
                ? '0 4px 15px rgba(187,134,252,0.6)'
                : '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              cursor: 'default',
              userSelect: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <h5 style={{ fontWeight: '600', fontSize: '1.2rem', marginBottom: '0.3rem' }}>
              {name}
            </h5>
            <div
              style={{
                fontSize: '1.1rem',
                marginBottom: '0.5rem',
                letterSpacing: '0.1rem',
              }}
            >
              {renderStars(rating)}
            </div>
            <p className="fst-italic" style={{ color: darkMode ? '#cbbcff' : '#495057' }}>
              "{feedback}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
