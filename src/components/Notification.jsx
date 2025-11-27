import React from "react";

const notifications = [
  {
    date: "Today",
    items: [
      {
        id: 1,
        title: "Reminder: Your event at MKS Mahal tomorrow!",
        message: "Don’t miss it.",
        time: "12:30 PM",
        highlight: true,
      },
      {
        id: 2,
        title: "Your payment was successful!",
        message: "Thank you for your payment. Your booking ID is #123456",
        time: "12:30 PM",
        highlight: true,
      },
      {
        id: 3,
        title: "Your booking is Confirmed 🎉",
        message: "We’re excited to host your event. View details in “My Bookings”.",
        time: "12:30 PM",
      },
    ],
  },
  {
    date: "Yesterday",
    items: [
      {
        id: 4,
        title: "Your quote has been approved!",
        message: "Check the details and confirm if you'd like to proceed.",
        time: "12:30 PM",
      },
      {
        id: 5,
        title: "Your quote has been under review!",
        message: "Our team is preparing the best options for you. Expect a response soon.",
        time: "12:30 PM",
      },
    ],
  },
  {
    date: "March 21, 2025",
    items: [
      {
        id: 6,
        title: "Exclusive Offer: Flat 20% Off on Wedding Venues!",
        message: "Book your dream venue today. Limited time only!",
        time: "12:30 PM",
      },
      {
        id: 7,
        title: "Upgrade your event with premium services!",
        message: "Check out our latest packages for catering, photography, and more.",
        time: "12:30 PM",
      },
    ],
  },
];

const Notification = () => {
  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto font-['Plus_Jakarta_Sans']">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#212121]">
            Stay Updated with Important Alerts
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Get updates on bookings, payments, and offers instantly.
          </p>
        </div>
        <button className="text-sm font-medium text-purple-600 hover:underline whitespace-nowrap">
          Read All
        </button>
      </div>

      {/* Notification Sections */}
      {notifications.map((section) => (
        <div key={section.date} className="mb-6">
          <p className="text-sm text-gray-400 font-semibold mb-2">{section.date}</p>
          <div className="space-y-3">
            {section.items.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 p-4 rounded-lg border ${item.highlight
                    ? "bg-[#F3EFFF] border-[#E2DFF6]"
                    : "bg-white border-[#E0E0E0]"
                  }`}
              >
                <div className="flex-1">
                  <p className="font-medium text-sm text-[#212121]">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.message}</p>
                </div>
                <span className="text-xs text-gray-400 sm:ml-4">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notification;
