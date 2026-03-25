import React, { useState } from 'react';
import './Faq.css';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const questions = [
    {
      question: "What types of cars are available for rent?",
      answer: "We offer a variety of cars, including sedans, SUVs, sports cars, and electric vehicles."
    },
    {
      question: "How do I make a reservation?",
      answer: "You can make a reservation online through our website or by calling our customer support."
    },
    {
      question: "Do I need insurance to rent a car?",
      answer: "Yes, you need to have insurance to rent a car, but we also offer insurance coverage options."
    },
    {
      question: "Can I pick up a car at one location and drop it off at another?",
      answer: "Yes, we offer flexible pick-up and drop-off locations, though additional fees may apply."
    }
  ];

  const handleToggle = (index) => {
    if (index === activeIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className="faq-container">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {questions.map((item, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`} 
            onClick={() => handleToggle(index)}
          >
            <div className="faq-question">
              <span className="faq-icon">{activeIndex === index ? '-' : '+'}</span>
              {item.question}
            </div>
            <div className="faq-answer">
              {activeIndex === index && item.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
