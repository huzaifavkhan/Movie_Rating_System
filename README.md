# **Movie Rating System**

This project is a web-based platform that allows users to browse, rate, and review movies. It’s designed to be intuitive and efficient, combining a PostgreSQL database with a Node.js backend and a React frontend to deliver a seamless user experience.

## **Features**

* ### **User Accounts**

  * Users can sign up, log in, and manage their accounts.
  * Each user can write reviews and rate movies.

* ### **Movie Browsing**

  * Search and view movie details.
  * See aggregated ratings and user reviews for each movie.

* ### **Ratings and Reviews**

  * Users can submit ratings and written reviews for any movie.
  * Average ratings are calculated and displayed in real-time.

## **Technical Details**

* ### **Backend**

  * Built with **Node.js** to handle API requests and connect to the database.
  * Uses Express for routing and RESTful endpoints.

* ### **Frontend**

  * Developed using **React**, providing a dynamic, responsive user interface.

* ### **Database**

  * Data is stored in **PostgreSQL** tables.
  * The database schema and table creation queries are stored in `Query_For_Database.txt`.

## **Installation & Setup**

Follow these steps to set up the project on your machine:

1. ### **Install Node.js & npm**

   * Download and install Node.js from [nodejs.org](https://nodejs.org/).
   * npm is included with Node.js.

2. ### **Install PostgreSQL**

   * Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/).
   * Create a new database using the SQL queries in `Query_For_Database.txt` to set up the required tables.

3. ### **Install Project Dependencies**

   * Open a terminal and navigate to the backend directory:

     ```bash
     cd backend
     npm install
     ```
   * Open another terminal, navigate to the frontend directory:

     ```bash
     cd frontend
     npm install
     ```
     
## **How to Run the Project**

1. **Open your terminal in split view** (or use two separate terminal windows).

2. In one terminal, navigate to the `backend` directory and run:

   ```bash
   node app.js
   ```

   This starts the Node.js server.

3. In the other terminal, navigate to the `frontend` directory and run:

   ```bash
   npm run start
   ```

   This launches the React development server.

## **Additional Notes**

* Make sure your PostgreSQL server is running.
* Update your database connection settings in the backend configuration if needed.
* Ensure `npm` is installed correctly to run `npm install` and `npm run start`.
