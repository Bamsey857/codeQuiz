import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import QuestionEditor from "./questionEditor";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function CourseQuestions({ questions, onQuestionUpdate }) {
  const [questionList, setQuestionList] = useState(questions);

  const addQuestion = (i) => {
    i = i !== undefined ? i : questionList.length;
    const newQuestion = {
      id: uuidv4(),
      type: "radio",
      question: "",
      description: "",
      data: {
        options: [
          {
            id: uuidv4(),
            text: "",
            isCorrect: false,
          },
        ],
      },
    };
    const updatedList = [
      ...questionList.slice(0, i),
      newQuestion,
      ...questionList.slice(i),
    ];
    setQuestionList(updatedList);
    onQuestionUpdate(updatedList);
  };

  const questionChange = (question) => {
    if (!question) return;
    const newQuestions = questionList.map((q) => {
      if (q.id === question.id) {
        return question;
      }
      return q;
    });
    setQuestionList(newQuestions);
    onQuestionUpdate(newQuestions);
  };

  const deleteQuestion = (question) => {
    const newQuestions = questionList.filter((q) => q.id !== question.id);
    setQuestionList(newQuestions);
    onQuestionUpdate(newQuestions);
  };

  useEffect(() => {
    onQuestionUpdate(questionList);
  }, [questionList]);

  return (
    <>
      <div className="flex justify-between">
        <h3 className="text-2xl font-bold">Questions</h3>
        <button
          type="button"
          className="flex items-center text-sm py-1 px-4 rounded-sm text-white bg-gray-600 hover:bg-gray-700"
          onClick={() => addQuestion()}
        >
          <PlusIcon className="mr-2 w-4" />
          Add Question
        </button>
      </div>
      {questionList.length > 0 ? (
        questionList.map((q, _i) => (
          <QuestionEditor
            question={q}
            key={q.id}
            questionChange={questionChange}
            addQuestion={addQuestion}
            deleteQuestion={deleteQuestion}
            index={_i}
          />
        ))
      ) : (
        <div className="text-center text-gray-400 py-4">
          You don't have any questions created yet.
        </div>
      )}
    </>
  );
}
