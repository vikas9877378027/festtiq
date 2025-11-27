import React from "react";
import { Star } from "@phosphor-icons/react";

const reviews = [
  {
    name: "Arjun",
    location: "Chennai",
    date: "Jan 7, 2025",
    rating: 5,
    comment:
      "Dolor enim ut tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis in bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.",
  },
  {
    name: "Arjun",
    location: "Chennai",
    date: "Jan 7, 2025",
    rating: 5,
    comment:
      "Dolor enim ut tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis in bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.",
  },
  {
    name: "Arjun",
    location: "Chennai",
    date: "Jan 7, 2025",
    rating: 5,
    comment:
      "Dolor enim ut tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis in bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.",
  },
  {
    name: "Arjun",
    location: "Chennai",
    date: "Jan 7, 2025",
    rating: 5,
    comment:
      "Dolor enim ut tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis in bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.",
  },
];

const Rating = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 font-['Plus_Jakarta_Sans']">
      {/* Divider */}
      <hr className="w-full border-t border-gray-200 mt-3 mb-10" />

      {/* Title */}
      <div className="mb-6">
        <h2 className="text-[#181375] text-2xl sm:text-3xl font-semibold">Ratings</h2>
        <p className="text-sm text-[#828282] py-2">
          <span className="text-yellow-500">★</span> 4.5 · 103 Reviews
        </p>
      </div>

      {/* Reviews */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {reviews.map((review, i) => (
          <div
            key={i}
            className="w-full border border-[#E0E0E0] rounded-lg p-6 flex flex-col gap-4"
          >
            {/* Profile */}
            <div className="flex items-center gap-3">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-[#181818]">{review.name}</p>
                <p className="text-xs text-[#828282]">{review.location}</p>
              </div>
            </div>

            {/* Rating & Date */}
            <div className="flex items-center gap-1 text-sm text-black">
              {Array.from({ length: review.rating }).map((_, j) => (
                <Star key={j} size={16} weight="fill" color="#FACC15" />
              ))}
              <span className="text-xs text-[#828282] ml-2">{review.date}</span>
            </div>

            {/* Comment */}
            <p className="text-sm text-[#4F4F4F] leading-5">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Show More */}
      <div className="text-center mt-6">
        <button className="text-sm font-medium underline text-[#181818]">
          Show more
        </button>
      </div>
    </div>
  );
};

export default Rating;
