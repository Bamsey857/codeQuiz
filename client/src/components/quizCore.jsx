export const RenderOptions = ({
  currentQuestion,
  userAnswers,
  handleAnswerChange,
  isTimerRunning,
  isSubmitted,
}) => {
  if (!currentQuestion) return null;

  return (
    <>
      {currentQuestion.data.options.map((option) => (
        <div key={option.id} className="mb-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type={currentQuestion.type === "checkbox" ? "checkbox" : "radio"}
              checked={
                currentQuestion.type === "checkbox"
                  ? userAnswers[currentQuestion.id]?.[option.id] || false
                  : userAnswers[currentQuestion.id] === option.id
              }
              onChange={() => handleAnswerChange(currentQuestion.id, option.id)}
              disabled={!isTimerRunning || isSubmitted}
              className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
            />
            <span className="text-gray-700">{option.text}</span>
          </label>
        </div>
      ))}
    </>
  );
};

export const RenderQuizResult = ({ quizResult, handleReset }) => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Result</h2>
      <div className="mb-6">
        <p className="text-2xl font-semibold text-indigo-600">
          Total Score: {quizResult.score}
        </p>
        <p className="text-lg text-gray-600">
          Correct Answers: {quizResult.totalCorrect}
        </p>
        <p className="text-lg text-gray-600">
          Wrong Answers: {quizResult.totalWrong}
        </p>
      </div>
      <button
        onClick={handleReset}
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Retake Quiz
      </button>
    </div>
  );
};
