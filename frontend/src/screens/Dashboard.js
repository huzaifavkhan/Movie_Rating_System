import React, { useEffect, useState } from "react";
import MovieSection from "../components/MovieSection";
import axios from "axios";

function Dashboard() {
  const [movies, setMovies] = useState({
    popular: [],
    new: [],
    suggested: [],
  });

  useEffect(() => {
    const fetchMovies = async (status) => {
      try {
        const response = await axios.get(`http://localhost:5000/moviesStatus?status=${status}`);
        return response.data
          .map(movie => ({
            id: movie.id, // Ensure we have an ID for each movie
            title: movie.title,
            image: `http://localhost:5000${movie.image_path}`,
            genre: movie.genre, // Assuming genre is returned from the backend
          }))
          .slice(0, 5); // Limit to 5 movies
      } catch (error) {
        console.error(`Error fetching ${status} movies:`, error);
        return [];
      }
    };
  
    const loadMovies = async () => {
      const popular = await fetchMovies("Popular");
      const newMovies = await fetchMovies("New");
      const suggested = await fetchMovies("Suggested");
  
      setMovies({
        popular,
        new: newMovies,
        suggested,
      });
    };
  
    loadMovies();
  }, []);

  return (
    <div style={{ backgroundColor: "black", color: "white", minHeight: "100vh", fontFamily: "Helvetica", fontSize:"22px", fontWeight: "bold" }}>
      <main style={{ padding: "20px" }}>
        <MovieSection title="Popular Movies" movies={movies.popular} />
        <MovieSection title="New Releases" movies={movies.new} />
        <MovieSection title="Suggested Movies" movies={movies.suggested} />
      </main>
    </div>
  );
}

export default Dashboard;
