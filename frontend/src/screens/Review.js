import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import binIcon from "./dustbin.jpg"; // Make sure this path is correct

function Review() {
  const [reviews, setReviews] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { movieId } = useParams();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUserEmail(parsedUser.email);
      setIsAdmin(parsedUser.isAdmin === true);
    }

    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/movies/${movieId}/reviews`);
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (movieId) {
      fetchReviews();
    }
  }, [movieId]);

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/movies/${movieId}/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      if (response.ok) {
        setReviews(reviews.filter((review) => review.review_id !== reviewId));
      } else {
        console.error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>Reviews</h2>
          <button style={modalStyles.closeButton} onClick={handleClose}>
            Close
          </button>
        </div>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <section key={review.review_id} style={modalStyles.reviewSection}>
              <div style={modalStyles.reviewHeader}>
                <div style={modalStyles.userInfo}>
                  <p style={modalStyles.username}>
                    <strong>{review.username}</strong>
                  </p>
                  <p style={modalStyles.email}>{review.email}</p>
                </div>
                {(currentUserEmail === review.email || isAdmin) && (
                  <img
                    src={binIcon}
                    alt="Delete"
                    title="Delete Review"
                    onClick={() => handleDeleteReview(review.review_id)}
                    style={modalStyles.binIcon}
                  />
                )}
              </div>
              <div style={modalStyles.reviewContent}>
                <p style={modalStyles.reviewText}>
                  <strong>Review:</strong> {review.review_text}
                </p>
                <p style={modalStyles.rating}>
                  <strong>Rating:</strong> {review.rating} / 10
                </p>
              </div>
            </section>
          ))
        ) : (
          <p style={modalStyles.noReviews}>No reviews yet</p>
        )}
      </div>
    </div>
  );
}

const baseFont = {
  fontFamily: "Calibri, sans-serif",
};

const modalStyles = {
  overlay: {
    ...baseFont,
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    ...baseFont,
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "80%",
    maxWidth: "600px",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  header: {
    ...baseFont,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    ...baseFont,
    margin: 0,
    color: "#000",
    fontSize: "24px",
  },
  closeButton: {
    ...baseFont,
    backgroundColor: "#ff4747",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  reviewSection: {
    ...baseFont,
    borderBottom: "1px solid #ccc",
    paddingBottom: "15px",
    marginBottom: "15px",
  },
  reviewHeader: {
    ...baseFont,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "10px",
  },
  userInfo: {
    ...baseFont,
    flex: 1,
  },
  username: {
    ...baseFont,
    margin: "0 0 5px 0",
    color: "#000",
    fontSize: "16px",
  },
  email: {
    ...baseFont,
    margin: 0,
    color: "#666",
    fontSize: "14px",
  },
  binIcon: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },
  reviewContent: {
    ...baseFont,
    marginTop: "10px",
  },
  reviewText: {
    ...baseFont,
    margin: "10px 0",
    color: "#000",
    lineHeight: "1.5",
  },
  rating: {
    ...baseFont,
    margin: "5px 0 0 0",
    color: "#000",
    fontSize: "16px",
  },
  noReviews: {
    ...baseFont,
    textAlign: "center",
    color: "#666",
    margin: "20px 0",
  },
};

export default Review;
