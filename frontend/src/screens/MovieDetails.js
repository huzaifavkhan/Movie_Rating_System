import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { isAuthenticated, user } = useAuth(); // Get user info

  useEffect(() => {
    fetch(`http://localhost:5000/movies/${id}`)
      .then((response) => response.json())
      .then((data) => setMovie(data))
      .catch((error) => console.error("Error fetching movie details:", error));
  }, [id]);

  const handleSubmit = async () => {
    if (!userReview.trim() || !userRating) {
      setErrorMessage("Both review and rating are required.");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (userRating < 1 || userRating > 10) {
      setErrorMessage("Rating must be between 1 and 10.");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    if (!user || !user.id) {
      setErrorMessage("Invalid user! Please login again!");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    setErrorMessage("");

    try {
      const payload = {
        user_id: user.id,
        review_text: userReview.trim(),
        rating: userRating,
      };

      const response = await axios.post(
        `http://localhost:5000/movies/${id}/reviews`,
        payload
      );

      const updatedAverageRating = isNaN(response.data.average_rating)
        ? 0
        : response.data.average_rating;
      const updatedNumReviews = isNaN(response.data.num_reviews)
        ? 0
        : response.data.num_reviews;

      setMovie((prevMovie) => ({
        ...prevMovie,
        average_rating: updatedAverageRating,
        num_reviews: updatedNumReviews,
      }));

      setUserReview("");
      setUserRating(0);
      setSuccessMessage("Review submitted successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrorMessage("Failed to submit review. Please try again.");
      setTimeout(() => setErrorMessage(""), 2000);
    }
  };

  if (!movie) {
    return <p style={{ color: "#fff" }}>Loading...</p>;
  }

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "'Arial', sans-serif",
        minHeight: "100vh",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", padding: "20px" }}>
        <div style={{ flex: "1", marginRight: "20px" }}>
          <img
            src={`http://localhost:5000${movie.image_path}`}
            alt={movie.title}
            style={{
              width: "100%",
              borderRadius: "10px",
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
            }}
          />
        </div>
        <div style={{ flex: "2" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "15px" }}>
            {movie.title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#FFD700",
                marginRight: "10px",
              }}
            >
              ⭐ {movie.average_rating} / 10
            </span>
            <span style={{ fontSize: "1.3rem", color: "#ccc" }}>
              <Link
                to={`/movie/${id}/reviews`}
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: "normal",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.fontWeight = "bold";
                  e.target.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.target.style.fontWeight = "normal";
                  e.target.style.textDecoration = "none";
                }}
              >
                (Reviews)
              </Link>
            </span>
          </div>

          <div style={{ marginBottom: "20px" }}>
            {movie.genres && Array.isArray(movie.genres) && movie.genres.length > 0 ? (
              movie.genres.map((genre, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: "#ff4747",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "20px",
                    marginRight: "10px",
                    fontSize: "0.9rem",
                  }}
                >
                  {genre}
                </span>
              ))
            ) : (
              <span style={{ color: "#ccc" }}>No genres available</span>
            )}
          </div>

          <p style={{ fontSize: "1rem", lineHeight: "1.6", marginBottom: "20px" }}>
            {movie.description}
          </p>

          {isAuthenticated && (
            <div style={{ marginTop: "20px" }}>
              <textarea
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                placeholder="Write a review"
                rows="6"
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "1rem",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  marginBottom: "10px",
                  resize: "none",
                }}
              />
              <div>
                <label
                  htmlFor="userRating"
                  style={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    marginRight: "10px",
                  }}
                >
                  Your Rating:
                </label>
                <input
                  type="number"
                  value={userRating}
                  onChange={(e) => setUserRating(Number(e.target.value))}
                  style={{
                    padding: "5px",
                    fontSize: "1rem",
                    width: "60px",
                    textAlign: "center",
                  }}
                  min="1"
                  max="10"
                />
              </div>
              <button
                onClick={handleSubmit}
                style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  fontSize: "1rem",
                  backgroundColor: "#ff4747",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </div>
          )}

          {errorMessage && (
            <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
          )}

          {successMessage && (
            <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
