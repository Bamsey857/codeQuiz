import React from "react";
import {
  ArrowTopRightOnSquareIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useStateContext } from "../context/StateContext";
import Button from "./core/button";

export default function Coursecard({ course, onDelete }) {
  const { user } = useStateContext();
  return (
    <div className="flex flex-col py-4 px-6 shadow-md bg-white hover:bg-gray-50 h-[470px]">
      <img
        src={course.image || course.image_url}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <h4 className="mt-4 text-lg font-bold">{course.title}</h4>
      <div
        dangerouslySetInnerHTML={{ __html: course.description }}
        className="overflow-hidden flex-1"
      ></div>

      <div className="flex justify-between items-center mt-3">
        {user.role === "student" || user?.id !== course.user_id ? (
          <Button to={`/course/view/${course.slug}`}>Attempt Quiz</Button>
        ) : (
          user?.id === course.user_id && (
            <Button to={`/course/${course.id}`}>
              <PencilIcon className="w-5 h-5 mr-2" />
              Edit
            </Button>
          )
        )}
        {user.role !== "student" && user?.id === course.user_id && (
          <div className="flex items-center">
            <Button to={`/course/view/${course.slug}`} circle link>
              <ArrowTopRightOnSquareIcon className="w-5 h-5" />
            </Button>

            {course.id && (
              <Button
                onClick={() => onDelete(course.id)}
                circle
                link
                color="red"
              >
                <TrashIcon className="w-5 h-5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
