import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const supportData = [
  {
    heading: "What information do we collect?",
    content: [
      "Dolor enim eu tortor urna sed. Aliquam vestibulum, nulla odio nisi vitae. In aliquet pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.",
      "Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo consectetur convallis risus. Sed condimentum enim dignissim adipiscing faucibus consequat, urna. Viverra purus et erat auctor aliquam. Risus, volutpat vulputate posuere purus sit congue convallis aliquet. Arcu id augue ut feugiat donec porttitor neque. Mauris, neque ultricies eu vestibulum, bibendum quam lorem id. Dolor lacus, eget nunc lectus in tellus, pharetra, porttitor.",
      "Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non pellentesque congue eget consectetur turpis. Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt aenean tempus. Quis velit eget ut tortor tellus. Sed vel, congue felis elit erat nam nibh orci.",
    ],
  },
  {
    heading: "How do we use your information?",
    content: [
      "Dolor enim eu tortor urna sed. Aliquam vestibulum, nulla odio nisi vitae. In aliquet pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.",
      "Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo consectetur convallis risus. Sed condimentum enim dignissim adipiscing faucibus consequat, urna. Viverra purus et erat auctor aliquam. Risus, volutpat vulputate posuere purus sit congue convallis aliquet. Arcu id augue ut feugiat donec porttitor neque.",
    ],
  },
  {
    heading: "Do we use cookies and other tracking technologies?",
    content: [
      "Pharetra magna ac placerat vestibulum lectus mauris ultrices. Amet dictum sit amet justo donec enim diam vulputate. Facilisis sed odio morbi quis commodo odio. Risus quis varius quam quisque id diam vel.",
    ],
  },
  {
    heading: "How long do we keep your information?",
    content: [
      "Amet dictum sit amet justo donec enim diam vulputate. Facilisis sed odio morbi quis commodo odio. Risus quis varius quam quisque id diam vel.",
    ],
  },
  {
    heading: "How do we keep your information safe?",
    content: [
      "Amet dictum sit amet justo donec enim diam vulputate. Facilisis sed odio morbi quis commodo odio. Risus quis varius quam quisque id diam vel.",
    ],
  },
  {
    heading: "What are your privacy rights?",
    content: [
      "Pharetra magna ac placerat vestibulum lectus mauris ultrices. Amet dictum sit amet justo donec enim diam vulputate. Facilisis sed odio morbi quis commodo odio.",
    ],
  },
  {
    heading: "How can you contact us about this policy?",
    content: [
      "1. Lorem ipsum dolor sit amet consectetur.",
      "2. Nulla facilisi morbi tempus iaculis urna.",
      "3. Sed lectus vestibulum mattis ullamcorper.",
    ],
  },
];

const Security = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: "30px" }}>
      <style>
        {`
          @media screen and (max-width: 768px) {
            .cookie-container {
              padding: 0 20px !important;
            }

            .cookie-inner {
              padding: 0 !important;
              max-width: 720px;
              margin: 0 auto;
            }

            .cookie-back-button {
              left: 20px !important;
              width: 44px !important;
              height: 44px !important;
            }

            .cookie-title {
              font-size: 32px !important;
              padding: 0 20px;
              text-align: center;
            }

            .cookie-heading {
              font-size: 22px !important;
            }

            .cookie-paragraph {
              font-size: 16px !important;
            }
          }
        `}
      </style>

 <div
  className="cookie-container"
  style={{
    width: "100%",
    maxWidth: "1440px",
    margin: "0 auto",
    padding: "0 96px", // updated from 192px
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    fontFamily: "Inter",
    color: "#212121",
  }}
>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            marginTop: "100px",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="cookie-back-button"
            style={{
              position: "absolute",
              left: "60px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              border: "1px solid #eee",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={28} />
          </button>

          <h1
            className="cookie-title"
            style={{
              fontFamily: "'Abhaya Libre', serif",
              fontWeight: 400,
              fontSize: "48px",
              lineHeight: "117%",
              letterSpacing: "-1.5px",
              color: "#181375",
              textAlign: "center",
              margin: 0,
            }}
          >
            Security
          </h1>
        </div>

        {/* Content */}
     <div
  className="cookie-inner"
  style={{
    width: "100%",
    padding: "0 96px", // updated from 192px
    display: "flex",
    flexDirection: "column",
    gap: "48px",
    boxSizing: "border-box",
  }}
>

          {/* Intro */}
          <div
            style={{
              fontSize: "18px",
              fontWeight: 400,
              fontFamily: "Inter",
              lineHeight: "28px",
              color: "#757575",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <p className="cookie-paragraph">
              Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget
              vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu
              amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.
            </p>
            <p className="cookie-paragraph">
              Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat mollis at volutpat lectus velit, sed auctor.
              Porttitor fames arcu quis fusce augue enim. Quis at habitant diam at. Suscipit tristique risus, at donec. In
              turpis vel et quam imperdiet. Ipsum molestie aliquet sodales id est ac volutpat.
            </p>
          </div>

          {/* FAQ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            {supportData.map((item, idx) => (
              <div key={idx}>
                <h2
                  className="cookie-heading"
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "30px",
                    lineHeight: "38px",
                    color: "#181375",
                    marginBottom: "12px",
                  }}
                >
                  {item.heading}
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {item.content.map((para, i) => (
                    <p
                      key={i}
                      className="cookie-paragraph"
                      style={{
                        fontFamily: "Inter",
                        fontWeight: 400,
                        fontSize: "18px",
                        lineHeight: "28px",
                        color: "#757575",
                        marginBottom: "12px",
                      }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
