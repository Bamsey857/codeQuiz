import { Alert } from "../components/alert";
import React, { useState, useEffect } from "react";
import { axiosClient } from "../utils/axiosClient";
import { RenderOptions, RenderQuizResult } from "./quizCore";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function QuizView({ questions, courseId }) {
  const [alert, setAlert] = useState({ type: null, message: null });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const totalTime = questions.length * 30;
    setTimeLeft(totalTime);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsTimerRunning(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions]);

  const handleAnswerChange = (questionId, answerId) => {
    if (!isTimerRunning || isSubmitted) return;

    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]:
        currentQuestion.type === "checkbox"
          ? {
              ...(prevAnswers[questionId] || {}),
              [answerId]: !prevAnswers[questionId]?.[answerId],
            }
          : answerId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    setIsTimerRunning(false);
    setAlert({ type: null, message: null });

    try {
      const { data } = await axiosClient.post(`/course/mark/${courseId}`, {
        courseId,
        answers: userAnswers,
      });

      if (!data.success) {
        throw new Error(
          data.message || "Failed to submit answers. Please try again."
        );
      }

      setQuizResult({
        score: data.score,
        totalWrong: data.correctAnswers.length,
        totalCorrect: questions.length - data.correctAnswers.length,
      });

      setAlert({
        type: "success",
        message: "Quiz submitted successfully!",
      });
    } catch (error) {
      console.error("Error submitting answers:", error);
      setAlert({
        type: "error",
        message: error.message || "Failed to submit answers. Please try again.",
      });
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setIsTimerRunning(true);
    setQuizResult(null);
    const totalTime = questions.length * 30;
    setTimeLeft(totalTime);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const renderQuizContent = () => (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${(timeLeft / (questions.length * 30)) * 100}%`,
            }}
          ></div>
        </div>
        <p className="text-sm font-medium text-gray-600">
          Time Remaining: {formatTime(timeLeft)}
        </p>
      </div>

      {currentQuestion && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {currentQuestion.question}
          </h3>
          {currentQuestion.description && (
            <p className="text-gray-600 mb-4">{currentQuestion.description}</p>
          )}
          <div className="space-y-2">
            <RenderOptions
              currentQuestion={currentQuestion}
              handleAnswerChange={handleAnswerChange}
              isSubmitted={isSubmitted}
              isTimerRunning={isTimerRunning}
              userAnswers={userAnswers}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRightIcon className="h-5 w-5 ml-1" />
        </button>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitted || !isTimerRunning}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-md border border-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Reset
        </button>
      </div>
    </>
  );

  return (
    <>
      {alert.message && <Alert type={alert.type} message={alert.message} />}
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        {isSubmitted && quizResult ? (
          <RenderQuizResult handleReset={handleReset} quizResult={quizResult} />
        ) : (
          renderQuizContent()
        )}
      </div>
    </>
  );
}
