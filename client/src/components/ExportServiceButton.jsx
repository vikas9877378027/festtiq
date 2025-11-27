
import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExploreAllServicesButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/services");
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center gap-2 mx-auto mt-4 text-white"
      style={{
        width: 245,
        height: 44,
        padding: "8px 20px",
        borderRadius: "8px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 600,
        fontSize: "16px",
        lineHeight: "26px",
        letterSpacing: "0.46px",
        background: "linear-gradient(180deg, #9C27B0 0%, #7B1FA2 100%)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#6A1B9A"; // dark purple instantly
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(180deg, #9C27B0 0%, #7B1FA2 100%)";
      }}
    >
      Explore All Services
      <ArrowUpRight size={20} />
    </button>
  );
};

export default ExploreAllServicesButton;

