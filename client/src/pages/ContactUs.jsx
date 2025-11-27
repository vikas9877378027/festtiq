import React, { useEffect } from "react";
import quoteImg from "../assets/venue/contactus1.png";
import heroBg from "../assets/venue/contactus3.png";
import mapImg from "../assets/services/map.png"; // vector map image

const ContactUs = () => {
     useEffect(() => {
      window.scrollTo(0, 0); 
    }, []);
  return (
    <div className="font-[Inter] pt-[100px]">
      {/* === HERO BANNER SECTION === */}
  <section
  className="relative w-full bg-cover bg-center bg-no-repeat flex justify-center items-center text-white px-4 md:px-12 xl:px-24"
  style={{
    backgroundImage: `url(${quoteImg})`,
    minHeight: "435px",
    paddingTop: "84px",
    paddingBottom: "84px",
  }}
>
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

  {/* Text Content */}
  <div
    className="relative z-10 flex flex-col items-center text-center gap-5 max-w-[900px] w-full"
  >
    <h2
      className="text-white text-[32px] md:text-[48px] leading-[117%] font-normal"
      style={{
        fontFamily: "Abhaya Libre",
        letterSpacing: "-1.5px",
      }}
    >
      Let’s Connect!
    </h2>
    <p
      className="text-white text-[16px] md:text-[20px] leading-[160%]"
      style={{
        fontFamily: "Plus Jakarta Sans",
        letterSpacing: "0.15px",
      }}
    >
      Have a question, need assistance, or want to start planning your event? <br />
      We’re here to help! Reach out to us through any of the options below.
    </p>
  </div>
</section>


      {/* === FORM HEADER === */}
      <h3
        style={{
          fontFamily: "'Abhaya Libre', serif",
          fontWeight: 400,
          fontStyle: "normal",
          fontSize: "48px",
          lineHeight: "117%",
          letterSpacing: "-1.5px",
          textAlign: "center",
          color: "#181375",
          marginBottom: "1px",
          marginTop: "20px",
        }}
      >
        Let’s Collaborate and Grow Together
      </h3>



<section className="w-full flex justify-center py-10 md:py-20 bg-white px-4">
  <div className="flex flex-col md:flex-row gap-5 w-full max-w-[1248px] items-stretch">
    {/* Left Image */}
    <div className="w-full md:w-[403px] h-[300px] md:h-[662px]">
      <img
        src={heroBg}
        alt="Contact"
        className="w-full h-full object-cover rounded-xl"
      />
    </div>

    {/* Right Form - Full Height */}
    <form
      className="w-full md:flex-1 bg-[#F5EDFF] rounded-[16px] px-6 py-8 md:p-[50px] flex flex-col gap-5 justify-between"
    >
      <h4 className="text-xl font-semibold text-[#212121] mb-1 text-[#3A0CA3]">
        Get Your Personalized Quote!
      </h4>

      {/* Full Name */}
      <div>
        <label className="text-sm font-medium text-[#212121] block mb-1">Full Name*</label>
        <input
          type="text"
          placeholder="Enter your full name"
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-purple-600"
        />
      </div>

      {/* Phone + Email */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <label className="text-sm font-medium text-[#212121] block mb-1">Phone Number*</label>
          <div className="flex gap-2">
            <select className="w-[80px] border border-gray-300 rounded-md px-2 py-2 text-sm">
              <option value="IN">IN 🇮🇳</option>
              <option value="US">US 🇺🇸</option>
              <option value="UK">UK 🇬🇧</option>
            </select>
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm outline-purple-600"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <label className="text-sm font-medium text-[#212121] block mb-1">Email*</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-purple-600"
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="text-sm font-medium text-[#212121] block mb-1">Subject*</label>
        <input
          type="text"
          placeholder="Enter Subject"
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-purple-600"
        />
      </div>

      {/* Message */}
      <div>
        <label className="text-sm font-medium text-[#212121] block mb-1">Message*</label>
        <textarea
          rows="4"
          placeholder="Enter your message"
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm resize-none outline-purple-600"
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-fit px-6 py-2 rounded-md text-white font-semibold mt-4"
        style={{
          background: "linear-gradient(180deg, #9C27B0 0%, #7B1FA2 100%)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "16px",
          lineHeight: "26px",
          letterSpacing: "0.46px",
          boxShadow:
            "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
        }}
      >
        Send Message
      </button>
    </form>
  </div>
</section>

      {/* === LOCATION SECTION === */}


<section
  className="w-full px-4 md:px-12 xl:px-24 py-10 flex flex-col items-center justify-center gap-10"
>
  <h2
    className="text-center text-[32px] md:text-[48px] text-[#181375]"
    style={{
      fontFamily: "Abhaya Libre",
      fontWeight: 400,
      lineHeight: "117%",
      letterSpacing: "-1.5px",
    }}
  >
    Visit Us - We’re Expanding
  </h2>

  {/* Map */}
  <div className="relative w-full max-w-[1440px] h-[400px] md:h-[600px] overflow-hidden">
    <img
      src={mapImg}
      alt="Location Map"
      className="w-full h-full object-contain"
    />

    {/* Marker + Info */}
    <div
      className="absolute flex flex-col items-center gap-2"
      style={{
        top: "62%",
        left: "65%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="bg-white px-4 py-3 rounded-md shadow-md min-w-[180px] text-left">
        <div className="flex items-center gap-2 mb-1">
          <img
            src="https://flagcdn.com/in.svg"
            alt="India Flag"
            className="w-[20px] h-[14px] object-cover"
          />
          <span
            className="text-sm font-semibold text-[#181375]"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            TamilNadu, India
          </span>
        </div>
        <p className="text-xs text-[#4B4B4B] m-0" style={{ fontFamily: "Plus Jakarta Sans" }}>
          Anna Nagar, <br />
          Chennai - 600102
        </p>
      </div>

      <div
        className="w-8 h-8 rounded-full"
        style={{
          backgroundColor: "rgba(156, 39, 176, 0.3)",
          boxShadow: "0 0 20px 10px rgba(156, 39, 176, 0.2)",
        }}
      />
    </div>
  </div>

  {/* Contact Info */}
  <div className="w-full mt-10 flex flex-col md:flex-row justify-between gap-10 max-w-[960px] text-center">
    <div className="flex-1 px-4">
      <h4 className="text-[22px] md:text-[25px] font-semibold text-[#000] mb-1">Support</h4>
      <p className="text-[#4B4B4B] text-sm mb-1">Our friendly team is here to help.</p>
      <a href="mailto:support@Festtiq.com" className="text-[#9C27B0] font-bold text-md underline">
        support@Festtiq.com
      </a>
    </div>

    <div className="flex-1 px-4">
      <h4 className="text-[22px] md:text-[25px] font-semibold text-[#000] mb-1">Sales</h4>
      <p className="text-[#4B4B4B] text-sm mb-1">Business Inquiries? Check Here First.</p>
      <a href="mailto:sales@Festtiq.com" className="text-[#9C27B0] font-bold text-md underline">
        sales@Festtiq.com
      </a>
    </div>

    <div className="flex-1 px-4">
      <h4 className="text-[22px] md:text-[25px] font-semibold text-[#000] mb-1">WhatsApp Us</h4>
      <p className="text-[#4B4B4B] text-sm mb-1">Mon–Fri from 8AM to 5PM</p>
      <a
        href="https://wa.me/919876543210"
        className="text-[#9C27B0] font-bold text-md underline"
      >
        +91 98765 43210
      </a>
    </div>
  </div>
</section>


{/* === FOOD WASTE HELPDESK SECTION === */}
<section className="w-full px-4 py-20 flex flex-col items-center gap-10">
  {/* Heading */}
  <h2
    className="text-center text-[32px] md:text-[48px] text-[#181375]"
    style={{
      fontFamily: "Abhaya Libre",
      fontWeight: 400,
      lineHeight: "117%",
      letterSpacing: "-1.5px",
    }}
  >
    Help Us Manage Food Waste
  </h2>

  {/* Description */}
  <p
    className="text-center text-[18px] md:text-[20px] leading-[160%] text-[#212121] px-2 max-w-[760px]"
    style={{
      fontFamily: "Plus Jakarta Sans",
      fontWeight: 400,
      letterSpacing: "0.15px",
    }}
  >
    Got leftover food from your event? Don’t let it go to waste! Partner with us to ensure your
    surplus food is put to good use or manage responsibly.
  </p>

  {/* Helpdesk Box */}
  <div
    className="w-full max-w-[880px] rounded-[24px] px-6 py-10 flex flex-col items-center text-center gap-4"
    style={{
      background: "linear-gradient(180deg, #9C27B0 0%, #7B1FA2 100%)",
    }}
  >
    <h3
      className="text-white text-[32px] md:text-[45px]"
      style={{
        fontFamily: "Abhaya Libre",
        fontWeight: 100,
        lineHeight: "117%",
        letterSpacing: "-1.5px",
        margin: 0,
      }}
    >
      Food Waste Helpdesk
    </h3>

    <p
      className="text-white text-[18px] md:text-[20px] leading-[160%]"
      style={{
        fontFamily: "Plus Jakarta Sans",
        fontWeight: 400,
        letterSpacing: "0.15px",
        margin: 0,
      }}
    >
      Call us to manage leftover food responsibly <br /> and make a difference.
    </p>

    <p
      className="text-white text-[28px] md:text-[32px] font-bold leading-[133%]"
      style={{
        fontFamily: "Plus Jakarta Sans",
        margin: "10px 0",
      }}
    >
      1800–123–4567
    </p>

    <button
      className="mt-3 bg-white text-[#7B1FA2] px-6 py-2 rounded-lg text-sm font-semibold shadow-md"
      style={{
        fontFamily: "Plus Jakarta Sans",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      Reach Out Now
    </button>
  </div>
</section>




    </div>
  );
};

export default ContactUs;
