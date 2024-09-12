import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuizView from "../components/quizView";
import PageComponent from "../components/core/pageComponent";
import { axiosClient } from "../utils/axiosClient";
import Loader from "../components/loader";

export default function CourseView() {
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [start, setStart] = useState(false);
  const { slug } = useParams();

  const fetchBySlug = async () => {
    try {
      const { data } = await axiosClient.get(`course/bySlug/${slug}`);
      if (!data.success) {
        throw new Error(data.message);
      }
      setCourse(data.course);
    } catch (error) {
      console.error("Error fetching course by slug:", error);
      setError(error.message || "Failed to fetch course");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBySlug();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <PageComponent title={course?.title || "Course View"}>
      <div className="max-w-3xl mx-auto">
        {course ? (
          <>
            <div className="mb-8">
              <div className="img">
                <img
                  src={course.image || course.image_url}
                  alt={course.title}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-left">
                  {course.title}
                  <span className="text-sm text-gray-500 ml-2">
                    ({course.questions.length}.Questions)
                  </span>
                </h1>
                {course.description && (
                  <p className="text-gray-600 text-left text-balance">
                    {course.description}
                  </p>
                )}
              </div>
            </div>
            {!start ? (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setStart(true)}
              >
                Start Quiz
              </button>
            ) : course.questions && course.questions.length > 0 ? (
              <QuizView courseId={course.id} questions={course.questions} />
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-yellow-700">
                  No questions available for this course yet.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">Course not found.</p>
          </div>
        )}
      </div>
    </PageComponent>
  );
}
