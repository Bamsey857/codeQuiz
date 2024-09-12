import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { questionTypes } from "../utils/qTypes";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function QuestionEditor({
  question,
  index,
  questionChange,
  addQuestion,
  deleteQuestion,
}) {
  const [model, setModel] = useState({ ...question });

  useEffect(() => {
    questionChange(model);
  }, [model]);

  const upperCaseFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  function shouldHaveOptions(type = null) {
    type = type || model.type;
    return ["select", "radio", "checkbox"].includes(type);
  }

  function onTypeChange(ev) {
    const newModel = {
      ...model,
      type: ev.target.value,
    };
    if (shouldHaveOptions(ev.target.value)) {
      newModel.data = {
        options: [
          {
            id: uuidv4(),
            text: "",
            isCorrect: false,
          },
        ],
      };
    }
    setModel(newModel);
  }

  function addOption() {
    model.data.options.push({
      id: uuidv4(),
      text: "",
      isCorrect: false,
    });
    setModel({ ...model });
  }

  function deleteOption(option) {
    model.data.options = model.data.options.filter((o) => o.id !== option.id);
    setModel({ ...model });
  }

  function toggleCorrectAnswer(optionId) {
    const updatedOptions = model.data.options.map((option) => {
      if (option.id === optionId) {
        return { ...option, isCorrect: !option.isCorrect };
      }
      if (model.type === "radio" || model.type === "select") {
        return { ...option, isCorrect: false };
      }
      return option;
    });
    setModel({ ...model, data: { ...model.data, options: updatedOptions } });
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800">
          Question {index + 1}
        </h4>
        <div className="flex space-x-2">
          <button
            type="button"
            className="flex items-center text-sm py-2 px-3 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out"
            onClick={() => addQuestion(index + 1)}
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add
          </button>
          <button
            type="button"
            className="flex items-center text-sm py-2 px-3 rounded-md text-white bg-red-600 hover:bg-red-700 transition duration-150 ease-in-out"
            onClick={() => deleteQuestion(question)}
          >
            <TrashIcon className="w-4 h-4 mr-1" />
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex w-full gap-3 justify-between items-center max-md:flex-col">
          <div className="w-full min-w-[80%]">
            <label htmlFor={`question-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <input
              type="text"
              name="question"
              id={`question-${index}`}
              required
              value={model.question}
              onChange={(ev) => setModel({ ...model, question: ev.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="w-full">
            <label htmlFor={`questionType-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
              Question Type
            </label>
            <select
              name="questionType"
              id={`questionType-${index}`}
              value={model.type}
              onChange={(e) => onTypeChange(e)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {questionTypes.map((type) => (
                <option key={type} value={type}>
                  {upperCaseFirst(type)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            id={`description-${index}`}
            value={model.description}
            onChange={(ev) => setModel({ ...model, description: ev.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows="3"
          ></textarea>
        </div>

        {shouldHaveOptions() && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h5 className="text-sm font-semibold text-gray-700">Options</h5>
              <button
                type="button"
                className="flex items-center text-xs py-1 px-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-150 ease-in-out"
                onClick={addOption}
              >
                <PlusIcon className="w-3 h-3 mr-1" />
                Add Option
              </button>
            </div>
            {model.data?.options && model.data.options.length > 0 ? (
              <div className="space-y-2">
                {model.data.options.map((option, _i) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 w-6">{_i + 1}.</span>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(ev) => {
                        option.text = ev.target.value;
                        model.data.options[_i] = option;
                        setModel({ ...model });
                      }}
                      className="flex-grow px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type={model.type === "checkbox" ? "checkbox" : "radio"}
                      checked={option.isCorrect}
                      onChange={() => toggleCorrectAnswer(option.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => deleteOption(option)}
                      className="text-red-600 hover:text-red-800 transition duration-150 ease-in-out"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">
                No options defined yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}