import React, { useEffect, useState } from "react";
import { Alert } from "../components/alert";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../context/StateContext";
import PageComponent from "../components/core/pageComponent";
import Button from "../components/core/button";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { axiosClient } from "../utils/axiosClient";
import CourseQuestions from "../components/courseQuestions";

const initialCourseState = {
  title: "",
  slug: "",
  status: false,
  description: "",
  image: null,
  image_url: null,
  questions: [],
};

export default function CourseEditor() {
  const { user } = useStateContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const [alert, setAlert] = useState({ type: null, message: null });
  const [course, setCourse] = useState(initialCourseState);
  const [Loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
      image_url:
        type === "file" ? URL.createObjectURL(files[0]) : prevCourse.image_url,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: null, message: null });

    const slug = course.title.replace(/\s+/g, "-").toLowerCase();
    let base64ImageData = null;

    if (course.image) {
      try {
        base64ImageData = await readFileAsBase64(course.image);
      } catch (error) {
        setAlert({ type: "error", message: "Failed to read the image file." });
        return;
      }
    }

    const payload = {
      ...course,
      image: base64ImageData,
      slug,
      questions: course.questions || [],
    };
    delete payload.image_url;

    const method = id ? "put" : "post";
    const successMessage = id
      ? "Course updated successfully"
      : "Course created successfully";

    setTimeout(async () => {
      try {
        const { data } = await axiosClient[method](`/courses`, payload);
        if (data.success) {
          setCourse(initialCourseState);
          setAlert({ type: "success", message: successMessage });
          setTimeout(() => {
            return navigate("/courses");
          }, 3000);
        } else {
          throw new Error(data.message || "Failed to create course");
        }
      } catch (error) {
        setAlert({
          type: "error",
          message: error.message || "Failed to create course, please try again",
        });
      }
    }, 500);
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onQuestionUpdate = (questions) => {
    setCourse({
      ...course,
      questions: questions,
    });
  };

  useEffect(() => {
    if (user && user.role === "student") {
      return navigate("/courses");
    }
    if (id) {
      setLoading(true);
      setTimeout(async () => {
        axiosClient
          .get(`/course/${id}`)
          .then(({ data }) => {
            if (!data.success) {
              setAlert({
                type: "error",
                message: data.message || "Course not found",
              });
              setCourse(initialCourseState);
              setTimeout(() => {
                navigate("/courses");
              }, 1000);
            } else {
              setCourse(data.course);
            }
          })
          .catch((error) => {
            setAlert({
              type: "error",
              message: error.message || "Something went wrong",
            });
            setTimeout(() => {
              navigate("/courses");
            }, 1000);
          })
          .finally(() => setLoading(false));
      }, 2000);
    }
  }, []);

  return (
    <PageComponent title={id ? "Edit Course" : "Create new Course"}>
      {alert.message && <Alert type={alert.type} message={alert.message} />}
      {Loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white px-4 py-5 sm:p-6 shadow sm:rounded-md gap-y-2"
        >
          <ImageUpload course={course} handleInputChange={handleInputChange} />
          <TextInput
            label="Course Title"
            name="title"
            value={course.title}
            onChange={handleInputChange}
            placeholder="Course Title"
          />
          <TextArea
            label="Course Description"
            name="description"
            value={course.description}
            onChange={handleInputChange}
            placeholder="Describe your course"
          />
          <Checkbox
            label="Active"
            name="status"
            checked={course.status}
            onChange={handleInputChange}
            description="Make this course publicly visible"
          />

          {course && course.questions && (
            <CourseQuestions
              onQuestionUpdate={onQuestionUpdate}
              questions={course.questions}
            />
          )}
          <div className="text-right">
            <Button type="submit">Save </Button>
          </div>
        </form>
      )}
    </PageComponent>
  );
}

const ImageUpload = ({ course, handleInputChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">Photo</label>
    <div className="mt-1 flex items-center">
      {course.image_url ? (
        <img
          src={course.image_url}
          className="h-32 w-32 object-cover"
          alt="Course"
        />
      ) : (
        <span className="flex justify-center items-center text-gray-400 h-12 w-12 overflow-hidden rounded-full bg-gray-100">
          <PhotoIcon className="w-8 h-8" />
        </span>
      )}
      <label className="relative ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer">
        Change
        <input
          type="file"
          className="absolute inset-0 opacity-0"
          onChange={handleInputChange}
          name="image"
        />
      </label>
    </div>
  </div>
);

export const TextInput = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      required
      type="text"
      name={name}
      id={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="mt-1 block w-full rounded-md border-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-2"
    />
  </div>
);

export const TextArea = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      name={name}
      id={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="mt-1 block w-full rounded-md border-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-2"
      rows={4}
    ></textarea>
  </div>
);

const Checkbox = ({ label, name, checked, onChange, description }) => (
  <div className="flex items-start">
    <div className="flex h-5 items-center">
      <input
        id={name}
        name={name}
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        checked={checked}
        onChange={onChange}
      />
    </div>
    <div className="ml-3 text-sm">
      <label htmlFor={name} className="font-medium text-gray-700">
        {label}
      </label>
      <p className="text-gray-500">{description}</p>
    </div>
  </div>
);
