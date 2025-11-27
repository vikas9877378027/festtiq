import React from "react";
import { eventCategories } from "../../pages/Home";

const EventCover = () => {
  return (
    <>
      <section style={{ width: "100%", textAlign: "center", marginTop: "0" }}>
        <h2
          style={{
            fontFamily: "Abhaya Libre",
            fontWeight: 200,
            fontStyle: "normal",
            fontSize: "48px",
            lineHeight: "117%",
            letterSpacing: "-1.5px",
            textAlign: "center",
            color: "#211C6A",
            marginBottom: "24px",
            marginTop: "40px",
          }}
        >
          Events We Cover For You
        </h2>

        <p
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 400,
            fontSize: "20px",
            lineHeight: "160%",
            letterSpacing: "0.15px",
            textAlign: "center",
            color: "#222",
            maxWidth: "900px",
            margin: "0 auto 30px",
          }}
        >
          Find the Perfect Venue for Every Occasion. From life's biggest
          milestones to intimate gatherings, we have venues tailored for all
          your needs.
        </p>
      </section>

      <div className="flex flex-wrap justify-center gap-6 px-4">
        {eventCategories.map((cat) => (
          <div
            key={cat.id}
            className="w-[403px] bg-[#F4F4F5] border border-[rgba(0,0,0,0.12)] rounded-[32px] flex flex-col gap-4 pb-5"
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-[250px] object-cover rounded-t-[32px]"
            />

            <h3
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: 600,
                fontSize: "28px",
                lineHeight: "124%",
                letterSpacing: "0.25px",
                color: "#181375",
                paddingLeft: "18px",
              }}
            >
              {cat.title}
            </h3>

            <div className="flex flex-wrap gap-2 px-4">
              {cat.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1 rounded-full text-[14px] font-normal"
                  style={{
                    backgroundColor: "rgba(156, 39, 176, 0.08)",
                    color: "#9C27B0",
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default EventCover;
