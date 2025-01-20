# BookStore Application

A web application that allows users to register, log in, and manage their favorite books. Users can authenticate via local sign-up/login or using Google OAuth. The application fetches book cover images from the Open Library API and provides a personalized dashboard for each user.

---

## Features

- **User Authentication:**
  - Local Authentication using email and password.
  - Google OAuth for seamless login.
- **Book Management:**
  - Submit books with title and author.
  - Automatically fetch and display book cover images from the Open Library API.
  - View all submitted books in a personalized dashboard.
- **Session Management:**
  - Persistent user sessions using cookies.
- **Responsive UI:**
  - Built with TailwindCSS for a clean and mobile-friendly interface.

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (via Mongoose)
- Passport.js for authentication
- Axios for API requests

### Frontend
- EJS (Embedded JavaScript templates)
- TailwindCSS for styling

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bookstore-app.git
   cd bookstore-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following variables:
   ```env
   SECRET_KEY=your-secret-key
   MONGO_URI=your-mongodb-connection-string
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GENSALT=10
   ```

4. Start the MongoDB server.

5. Run the application:
   ```bash
   npm start
   ```

6. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Directory Structure

```
project/
|-- models/
|   |-- user.js
|   |-- book.js
|-- public/
|-- views/
|   |-- signup.ejs
|   |-- login.ejs
|   |-- bookStore.ejs
|   |-- yourBooks.ejs
|-- middlewares/
|   |-- auth.js
|-- config/
|   |-- mongoose-connection.js
|-- .env
|-- app.js
|-- package.json
```

---

## API Endpoints

### Public Routes

- `GET /` - Renders the signup page.
- `GET /login` - Renders the login page.

### Protected Routes

- `GET /BookStore` - Displays the dashboard for authenticated users.
- `POST /books/submit` - Submits a new book and fetches its cover image.
- `GET /books` - Displays all books added by the user.
- `GET /logout` - Logs out the user and redirects to the homepage.

### Authentication Routes

- `GET /auth/google` - Initiates Google OAuth authentication.
- `GET /auth/google/BookStore` - Google OAuth callback route.

---

## To-Do

- Add support for editing and deleting books.
- Implement password reset functionality.
- Add pagination for the books dashboard.
- Improve error handling and user feedback.

---

## Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

