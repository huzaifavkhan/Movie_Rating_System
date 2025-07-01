import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { useEffect, useState } from "react";

// Helper function to shuffle an array
const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
};

function MovieSection({ title }) {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const status = title === "Popular Movies" ? "Popular" : title === "New Releases" ? "New" : title === "Suggested Movies" ? "Suggested" : "";

  // Fetch movies data from the API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:5000/movies"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch movies.");
        }
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  // Filter and shuffle the movies by category
  const filteredMovies = shuffleArray(movies.filter((movie) => movie.status === status)).slice(0, 5);

  // Function to navigate to the movie details page
  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`); // Navigate to MovieDetails with ID
  };

  return (
    <section style={{ marginBottom: "40px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>{title}</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)", // 5 cards per row
          gap: "15px", // Adjusted gap for better spacing
        }}
      >
        {filteredMovies.map((movie, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#333",
              borderRadius: "10px", // Slightly rounded corners for a clean look
              overflow: "hidden", // Ensures no content overflows
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
              textAlign: "center",
              width: "100%", // Occupy full grid space
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              position: "relative", // Needed for absolute positioning of hover content
              cursor: "pointer", // Show pointer cursor on hover
              transition: "transform 0.3s ease", // Smooth scaling effect
            }}
            onClick={() => handleMovieClick(movie.id)} // On click, go to the movie page
            className="movie-card"
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingTop: "152.25%", // 16:9 aspect ratio (height = 56.25% of the width)
                overflow: "hidden", // Prevents overflow of the image
              }}
            >
              <img
                src={`http://localhost:5000${movie.image_path}`} // Updated image source
                alt={movie.title}
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", // Ensures the image fills the container without stretching
                }}
              />
            </div>
            <p
              style={{
                fontSize: "16px", // Adjust font size as needed
                color: "#fff",
                marginTop: "10px", // Add some space between the image and the title
                textOverflow: "ellipsis", // Truncate text if it's too long
                whiteSpace: "nowrap", // Prevent the title from wrapping
                overflow: "hidden",
              }}
            >
              {movie.title}
            </p>
            {/* Hover effect with genre */}
            <div
              style={{
                padding: "10px",
                backgroundColor: "#222", // Background color for the title section
                borderTop: "1px solid #444", // Adds a separator line
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                transition: "opacity 0.3s ease", // Transition for opacity
                opacity: 0, // Initially hidden
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
              className="hover-info"
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "#fff",
                  margin: "0",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {movie.genre} {/* Display genre */}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MovieSection;
