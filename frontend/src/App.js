

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const MovieGrid = () => {
//   const [movies, setMovies] = useState([]);

//   // Fetch movies from the backend on component mount
//   useEffect(() => {
//     const fetchMovies = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/movies");
//         setMovies(response.data); // Set fetched movie data into state
//       } catch (error) {
//         console.error("Error fetching movies:", error);
//       }
//     };

//     fetchMovies();
//   }, []);

//   // Group movies into categories (Popular, New Movies, Suggested)
//   const categories = {
//     Popular: movies.slice(0, 5),
//     "New movies": movies.slice(5, 10),
//     Suggested: movies.slice(10, 15),
//   };

//   return (
//     <div style={styles.container}>
//       {Object.entries(categories).map(([category, categoryMovies]) => (
//         <div style={styles.section} key={category}>
//           <h2 style={styles.sectionTitle}>{category}</h2>
//           <div style={styles.grid}>
//             {categoryMovies.map((movie, index) => (
//               <div key={index} style={styles.card}>
//                 <img
//                   src={`http://localhost:5000${movie.image_path}`}
//                   alt={movie.title}
//                   style={styles.image}
//                 />
//                 <p style={styles.movieTitle}>{movie.title}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     backgroundColor: "#000",
//     color: "#fff",
//     fontFamily: "Arial, sans-serif",
//     padding: "20px",
//   },
//   section: {
//     marginBottom: "30px",
//   },
//   sectionTitle: {
//     fontSize: "24px",
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: "10px",
//   },
//   grid: {
//     display: "flex",
//     justifyContent: "center",
//     gap: "10px",
//   },
//   card: {
//     backgroundColor: "#fff",
//     color: "#000",
//     width: "100px",
//     height: "150px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: "8px",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//     padding: "5px",
//   },
//   image: {
//     width: "80px",
//     height: "80px",
//     objectFit: "cover",
//     borderRadius: "4px",
//     marginBottom: "10px",
//   },
//   movieTitle: {
//     fontSize: "14px",
//     textAlign: "center",
//   },
// };

// export default MovieGrid;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Dashboard from "./screens/Dashboard";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import Members from "./screens/Members";
import MovieDetails from "./screens/MovieDetails";
import Films from "./screens/Films";
import Review from './screens/Review';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div>
      <Header isAuthenticated={isAuthenticated} logout={logout} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/films" element={<Films />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movie/:movieId/reviews" element={<Review />} />

        {/* Only show this route if user is logged in and is an admin */}
        {isAuthenticated && user?.isAdmin && (
          <Route path="/members" element={<Members />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
