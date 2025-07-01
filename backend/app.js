const express = require('express');
const path = require('path');
const cors = require("cors");
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

// === ROUTES ===

// Fetch all movies
app.get('/movies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movies');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Fetch movies by status
app.get('/moviesStatus', async (req, res) => {
  const { status } = req.query;
  try {
    const query = "SELECT title, image_path FROM movies WHERE status = $1 ORDER BY RANDOM() LIMIT 5";
    const result = await pool.query(query, [status]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Signup
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const query = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id`;
    const result = await pool.query(query, [username, email, password]);
    res.status(201).json({ message: 'User registered successfully!', userId: result.rows[0].id });
  } catch (error) {
    console.error('Error saving user to database:', error);
    if (error.code === '23505') {
      res.status(409).json({ message: 'Email or username already exists.' });
    } else {
      res.status(500).json({ message: 'An error occurred during registration.' });
    }
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0 || result.rows[0].password !== password) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    res.status(200).json({ success: true, message: 'Login successful!', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all members
app.get('/members', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email FROM users ORDER BY id');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users from the database.' });
  }
});

// Delete member
app.delete('/members/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get movie by ID
app.get("/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("Movie not found");
    }
    const movie = result.rows[0];
    movie.genres = movie.genre ? movie.genre.split(',').map(g => g.trim()) : [];
    res.json(movie);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get reviews for movie
app.get('/movies/:id/reviews', async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid movie ID" });
  }
  try {
    const query = `
      SELECT r.id AS review_id, r.review_text, r.rating, u.email, u.username
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.movie_id = $1`;
    const result = await pool.query(query, [parseInt(id)]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Submit review (user_id comes from req.body)
app.post('/movies/:id/reviews', async (req, res) => {
  const movieId = parseInt(req.params.id);
  const { user_id, review_text, rating } = req.body;

  if (!movieId || isNaN(movieId)) {
    return res.status(400).json({ error: "Invalid movie ID" });
  }
  if (!user_id || !review_text || rating === undefined) {
    return res.status(400).json({ error: 'All fields (user_id, review_text, rating) are required.' });
  }
  const numericRating = parseFloat(rating);
  if (isNaN(numericRating) || numericRating < 0 || numericRating > 10) {
    return res.status(400).json({ error: 'Rating must be a number between 0 and 10.' });
  }

  try {
    await pool.query('BEGIN');
    await pool.query(
      `INSERT INTO reviews (movie_id, user_id, review_text, rating)
       VALUES ($1, $2, $3, $4)`,
      [movieId, user_id, review_text.trim(), numericRating]
    );
    const updateResult = await pool.query(
      `UPDATE movies
       SET average_rating = (
         SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
         FROM reviews
         WHERE movie_id = $1
       )
       WHERE id = $1
       RETURNING *`,
      [movieId]
    );
    await pool.query('COMMIT');
    res.status(201).json(updateResult.rows[0]);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// Delete review
app.delete('/movies/:movieId/reviews/:reviewId', async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const reviewId = parseInt(req.params.reviewId);
  const { is_admin } = req.body;

  if (!movieId || isNaN(movieId) || !reviewId || isNaN(reviewId)) {
    return res.status(400).json({ error: "Invalid movie ID or review ID" });
  }

  try {
    await pool.query('BEGIN');

    let result;
    if (is_admin) {
      // Admin can delete any review by review ID alone
      result = await pool.query(
        `DELETE FROM reviews WHERE id = $1 RETURNING *`,
        [reviewId]
      );
    } else {
      // Regular users must match both movieId and reviewId
      result = await pool.query(
        `DELETE FROM reviews WHERE id = $1 AND movie_id = $2 RETURNING *`,
        [reviewId, movieId]
      );
    }

    if (result.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Review not found' });
    }

    await pool.query(
      `UPDATE movies
       SET average_rating = (
         SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
         FROM reviews
         WHERE movie_id = $1
       )
       WHERE id = $1`,
      [movieId]
    );

    await pool.query('COMMIT');
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});


// Admin signup
app.post('/admin/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const query = `
      INSERT INTO users (username, email, password, is_admin) 
      VALUES ($1, $2, $3, true) 
      RETURNING id
    `;
    const result = await pool.query(query, [username, email, password]);
    res.status(201).json({ message: 'Admin registered successfully!', userId: result.rows[0].id });
  } catch (error) {
    console.error('Error saving admin to database:', error);
    if (error.code === '23505') {
      res.status(409).json({ message: 'Email or username already exists.' });
    } else {
      res.status(500).json({ message: 'An error occurred during registration.' });
    }
  }
});

// Admin login
app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_admin = true',
      [email]
    );
    if (result.rows.length === 0 || result.rows[0].password !== password) {
      return res.status(400).json({ success: false, message: 'Invalid admin credentials' });
    }
    res.status(200).json({ success: true, message: 'Admin login successful!', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
