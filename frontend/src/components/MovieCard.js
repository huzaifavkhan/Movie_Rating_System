import React from "react";

function MovieCard({ name }) {
  return (
    <div
      style={{
        color: "black",
        width: "120px",
        height: "180px",
        backgroundColor: "yellow",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
        // Add hover effect
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "scale(1.1)";
        e.target.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.5)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "scale(1)";
        e.target.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.3)";
      }}
    >
      {name}
    </div>
  );
}

export default MovieCard;
