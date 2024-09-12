
---

# CodeQuiz

CodeQuiz is a web-based quiz application built with React.js and Express.js. It provides a platform for teachers to create and upload courses with questions, and for students to attempt quizzes. The application features user authentication, a scoreboard to display total answers, and a student dashboard (currently in progress) for analytics.

## Features

- **User Signup**: Users can sign up as either a Teacher or a Student.
- **Teacher Capabilities**: Teachers can upload courses with multiple-choice questions.
- **Student Capabilities**: Students can attempt quizzes but cannot create or upload content.
- **Scoreboard**: Displays the total number of answers attempted by students.
- **Authentication**: Secure user authentication to ensure data privacy and integrity.
- **Student Dashboard (In Progress)**: Future feature to provide detailed analytics and performance insights for students.

## Project Structure

- **Backend (Express.js)**:
  - Handles API requests.
  - Manages user authentication and course data storage.
  - Uses file-based storage for simplicity.

- **Frontend (React.js)**:
  - Provides the user interface for interacting with the quiz application.
  - Allows teachers to manage courses and students to attempt quizzes.

## Setup Instructions

### Prerequisites

- Node.js and npm installed on your machine.

### Cloning the Repository

```bash
git clone https://github.com/Bamsey857/codeQuiz
cd codequiz
```

### Setting Up the Backend

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create an `.env` file**:
   Copy the example file and configure environment variables as needed.
   ```bash
   cp .env.example .env
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

### Setting Up the Frontend

1. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the React application**:
   ```bash
   npm start
   ```

### Accessing the Application

- **Frontend**: Open your browser and navigate to `http://localhost:3000` to access the React application.
- **Backend API**: The Express server runs on `http://localhost:5000` and handles API requests.

## Usage

1. **Signup**: 
   - **Teacher**: Register as a teacher to upload courses and manage questions.
   - **Student**: Register as a student to attempt quizzes.

2. **Teacher Dashboard**: 
   - Upload courses with questions.
   - Manage existing courses.

3. **Student Dashboard**:
   - Attempt quizzes.
   - View the scoreboard to see total answers attempted.

4. **Scoreboard (In Progress)**:
   - View aggregated statistics on attempted answers.

## Authentication

- The application features a robust authentication system to secure user data.
- Ensure to create and configure `.env` file for proper authentication setup.

## Future Enhancements

- **Student Dashboard Analytics**: A future feature that will provide insights and analytics on student performance.
- **Database Integration**: While the current implementation uses file-based storage, integrating a relational or NoSQL database may be considered for scalability and performance improvements.

## Notes

- This project is designed to be straightforward and accessible.
- For production use, consider implementing additional security measures and optimizing performance.

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---