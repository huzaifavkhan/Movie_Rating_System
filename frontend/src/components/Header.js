import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./styles.css";

function Header({ isAuthenticated, logout }) {
  const { user } = useAuth();

  return (
    <header
      style={{
        backgroundColor: "#222",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link
        to="/"
        style={{
          fontSize: "36px",
          margin: 0,
          color: "red",
          fontFamily: "'Berlin Sans FB', cursive",
          textDecoration: "none",
        }}
      >
        Movie Rating
      </Link>
      <nav style={{ display: "flex", gap: "20px" }}>
        <Link
          to="/films"
          style={{
            color: "white",
            textDecoration: "none",
            fontFamily: "arial, sans-serif",
            fontWeight: "bold",
          }}
        >
          Discover
        </Link>

        {/* Only show Members if logged in and user is admin */}
        {isAuthenticated && user?.isAdmin && (
          <Link
            to="/members"
            style={{
              color: "white",
              textDecoration: "none",
              fontFamily: "arial, sans-serif",
              fontWeight: "bold",
            }}
          >
            Members
          </Link>
        )}

        {!isAuthenticated ? (
          <Link
            to="/login"
            style={{
              color: "white",
              textDecoration: "none",
              fontFamily: "arial, sans-serif",
              fontWeight: "bold",
            }}
          >
            Login
          </Link>
        ) : (
          <Link
            to="/login"
            onClick={logout}
            style={{
              color: "white",
              textDecoration: "none",
              fontFamily: "arial, sans-serif",
              fontWeight: "bold",
            }}
          >
            Logout
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
