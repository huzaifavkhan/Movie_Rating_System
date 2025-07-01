import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook

function Films() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    fetch("http://localhost:5000/movies")
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
        setFilteredMovies(data);
      })
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const result = movies.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMovies(result);
  };

  const handleGenreFilter = (genre) => {
    const result = movies.filter((movie) => movie.genre.includes(genre));
    setFilteredMovies(result);
  };

  const handleYearFilter = (decade) => {
    const start = parseInt(decade.slice(0, 4), 10); // Extract decade start year (e.g., 1930 from "1930s")
    const end = start + 9; // Calculate end year of the decade
    const result = movies.filter((movie) => {
      const movieYear = new Date(movie.release_date).getFullYear();
      return movieYear >= start && movieYear <= end;
    });
    setFilteredMovies(result);
  };
  

  const handleRatingFilter = (rating) => {
    const parsedRating = parseFloat(rating);
    const result = movies.filter((movie) => {
      const movieRating = parseFloat(movie.average_rating);
      return Math.floor(movieRating) === Math.floor(parsedRating);
    });
    setFilteredMovies(result);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`); // Navigate to MovieDetails with ID
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#000", color: "#fff", minHeight:"100nh"}}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
          marginBottom: "40px",
        }}
      >
        {/* Search Input */}
        <input
          type="text"
          placeholder="search for a movie"
          value={searchQuery}
          onChange={handleSearch}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginRight: "10px",
            width: "300px",
          }}
        />

        {/* Genre Dropdown */}
        <button
          onMouseEnter={() => setShowGenreDropdown(true)}
          onMouseLeave={() => setShowGenreDropdown(false)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#555",
            borderRadius: "5px",
            color: "#fff",
            marginRight: "5px",
            border: "none",
            position: "relative",
          }}
        >
          Genre
          {showGenreDropdown && (
            <div
              style={{
                position: "absolute",
                top: "35px",
                left: "0",
                backgroundColor: "#333",
                borderRadius: "5px",
                width: "120px",
                padding: "0px 0",
                zIndex: "1000",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
              }}
            >
              {["Action", "Animation","Crime", "Drama", "Family", "Fantasy", "Musical", "Mystery", "Redemption", "Romantic", "Sci-Fi", "Thriller"].map((genre, index) => (
                <div
                  key={index}
                  style={{
                    padding: "5px 10px",
                    borderBottom: index !== 2 ? "1px solid #444" : "none",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  onClick={() => handleGenreFilter(genre)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#555")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  {genre}
                </div>
              ))}
            </div>
          )}
        </button>

        {/* Year Dropdown */}
        <button
          onMouseEnter={() => setShowYearDropdown(true)}
          onMouseLeave={() => setShowYearDropdown(false)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#555",
            borderRadius: "5px",
            color: "#fff",
            marginRight: "5px",
            border: "none",
            position: "relative",
          }}
        >
          Year
          {showYearDropdown && (
            <div
              style={{
                position: "absolute",
                top: "35px",
                left: "0",
                backgroundColor: "#333",
                borderRadius: "5px",
                width: "120px",
                padding: "0px 0",
                zIndex: "1000",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
              }}
            >
              {["1930s", "1940s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"].map(
                (year, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "5px 10px",
                      borderBottom: index !== 9 ? "1px solid #444" : "none",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                    onClick={() => handleYearFilter(year)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#555")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    {year}
                  </div>
                )
              )}
            </div>
          )}
        </button>

        {/* Rating Dropdown */}
        <button
          onMouseEnter={() => setShowRatingDropdown(true)}
          onMouseLeave={() => setShowRatingDropdown(false)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#555",
            borderRadius: "5px",
            color: "#fff",
            marginRight: "5px",
            border: "none",
            position: "relative",
          }}
        >
          Rating
          {showRatingDropdown && (
            <div
              style={{
                position: "absolute",
                top: "35px",
                left: "0",
                backgroundColor: "#333",
                borderRadius: "5px",
                width: "120px",
                padding: "0px 0",
                zIndex: "1000",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
              }}
            >
              {["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars", "6 Stars", "7 Stars", "8 Stars", "9 Stars", "10 Stars"].map(
                (rating, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "5px 10px",
                      borderBottom: index !== 4 ? "1px solid #444" : "none",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                    onClick={() => handleRatingFilter(rating)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#555")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    {rating}
                  </div>
                )
              )}
            </div>
          )}
        </button>
      </div>

      {/* Movies Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "15px",
        }}
        
      >
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <div
              key={movie.id}
              style={{
                backgroundColor: "#333",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.3s ease",
              }}
              onClick={() => handleMovieClick(movie.id)}
              className="movie-card"
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "152.25%", // 16:9 aspect ratio
                  overflow: "hidden",
                }}
              >
                <img
                  src={`http://localhost:5000${movie.image_path}`}
                  alt={movie.title}
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: "16px",
                  color: "#fff",
                  marginTop: "10px",
                  textAlign: "center",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {movie.title}
              </p>
            </div>
          ))
        ) : (
          <p style={{ color: "#fff" }}>No movies found.</p>
        )}
      </div>
    </div>
  );
}

export default Films;