# CodeQuiz

CodeQuiz is a web application built with Express and React that allows teachers to create, manage, and administer quizzes, while students can view and attempt these quizzes.

## Features

### For Teachers
- User registration as a teacher
- Create, update, and delete course quizzes
- Dashboard to manage quizzes (more features coming soon)

### For Students
- User registration as a student
- View available quizzes
- Attempt quizzes
- Student dashboard (analytics coming soon)

## Tech Stack

- **Frontend**: React (with Vite)
- **Backend**: Express.js
- **Database**: JSON file-based storage (easily modifiable for future database integration)

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/codequiz.git
   cd codequiz
   ```

2. Install dependencies for both client and server:
   ```
   cd client && npm install
   cd ../server && npm install
   ```

3. Create a `.env` file in the server directory based on the `.env.example` file.

### Running the Application

1. Start the server (from the server directory):
   ```
   npm start
   ```
   The server will run on port 5000.

2. Start the client (from the client directory):
   ```
   npm run dev
   ```
   The client will run on port 3000.

3. Open your browser and navigate to `http://localhost:3000` to use the application.

## Future Updates

- Enhanced teacher dashboard:
  - View total quizzes created
  - See the number of times each quiz was attempted
  - Sorting and filtering options
- Improved student dashboard with analytics
- Integration with structural databases

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
