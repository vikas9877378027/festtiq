// src/pages/Venues.jsx
import React from 'react';
import event1 from '../assets/events/event1.png';
import event2 from '../assets/events/event2.png';
import event3 from '../assets/events/event3.png';
import event4 from '../assets/events/event4.png';
import event5 from '../assets/events/event5.png';
import event6 from '../assets/events/event6.png';

export const eventCategories = [
  {
    id: 'wedding',
    title: 'Wedding',
    image: event1,
    tags: ['Engagement','Mehndi','Sangeet','Wedding Ceremony','Reception'],
  },
  {
    id: 'parties',
    title: 'Parties',
    image: event2,
    tags: ['Birthday Parties','Anniversary Celebrations','Baby Showers','Farewell Parties','Dinner Parties'],
  },
  {
    id: 'corporate',
    title: 'Corporate Events',
    image: event3,
    tags: ['Conferences','Team Outings','Product Launches','Annual General Meetings','Training Sessions'],
  },
  {
    id: 'family',
    title: 'Family Celebrations',
    image: event4,
    tags: ['Family Reunion','Naming Ceremonies','Pet Parties','Get-Together','Retirement Parties'],
  },
  {
    id: 'entertainment',
    title: 'Entertainment Shows',
    image: event5,
    tags: ['Live Concerts','Stand-up Comedy Shows','Movie Screenings','Fashion & Talent Shows'],
  },
  {
    id: 'cultural',
    title: 'Cultural Events',
    image: event6,
    tags: ['Festivals','Community Gatherings','Spiritual Retreats','Traditional Dance or Music Shows'],
  },
];

export default function Venues() {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {eventCategories.map((cat) => (
        <div
          key={cat.id}
          className="
            w-[403px]
            bg-[#F4F4F5]
            border
            border-[rgba(0,0,0,0.12)]
            rounded-[32px]
            flex flex-col
            gap-4
            pb-5
          "
        >
          {/* Image with only top corners rounded */}
          <img
            src={cat.image}
            alt={cat.title}
            className="
              w-full
              h-[250px]
              object-cover
              rounded-t-[32px]
            "
          />

          {/* Title styled per Figma */}
          <h3
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 600,
              fontSize: '28px',
              lineHeight: '124%',
              letterSpacing: '0.25px',
              color: '#181375',
              width: '373px',
              height: '35px',
            }}
          >
            {cat.title}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 px-4">
            {cat.tags.map((tag) => (
              <span
                key={tag}
                className="
                  text-sm
                  bg-[#EDE0FF]
                  text-[#7B2CBF]
                  rounded-full
                  px-3
                  py-1
                "
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
