
import React, { useState } from "react";
import "./Questions.css";   // make sure the path matches your project

const faqs = [
  {
    question: "How to Find the Perfect Venue?",
    answer:
      "Our platform offers advanced filters that let you narrow down your options quickly. You can search for venue based on location, budget range, guest capacity, and specific amenities like parking, air conditioning, or outdoor space. Additionally, you can view detailed venue profiles with photos, videos, and verified reviews to make an informed decision.",
  },
  {
    question: "Understanding Pricing and Availability",
    answer:
      "You can search for venues based on location, guest capacity, and amenities. See transparent pricing and check real-time availability with ease.",
  },
  {
    question: "The Booking Process Simplified",
    answer:
      "We’ve streamlined the booking process to make it simple and stress-free. Choose a venue, confirm details, and book in just a few clicks.",
  },
  {
    question: "Additional Services for Your Event",
    answer:
      "From catering and décor to on-site coordination, we offer a range of services to enhance your event experience.",
  },
];

export default function Question() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="faq-section">
      {/* ---------- Heading ---------- */}
      <div className="faq-heading">
        <h2 className="faq-title">
          Everything you need to know about Festtiq
        </h2>
        <p className="faq-subtitle">
          Explore detailed guides and FAQs about our services, venue options,
          booking processes, and tips to make your event unforgettable. We’ve
          got you covered!
        </p>
      </div>

      {/* ---------- FAQ Items ---------- */}
      <div className="faq-list">
        {faqs.map((item, idx) => (
          <div
            key={idx}
            className={`faq-item ${openIndex === idx ? "open" : ""}`}
            onClick={() => toggle(idx)}
          >
            <div className="faq-header">
              <span className="faq-number">{String(idx + 1).padStart(2, "0")}</span>
              <span className="faq-question">{item.question}</span>

              {/* toggle button */}
              <button
                className="faq-toggle"
                style={{
                  backgroundColor: openIndex === idx ? "#9C27B0" : "transparent",
                  color: openIndex === idx ? "#fff" : "#333",
                }}
                aria-label={openIndex === idx ? "Collapse" : "Expand"}
              >
                {openIndex === idx ? "−" : "+"}
              </button>
            </div>

            {/* answer */}
            {openIndex === idx && (
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
