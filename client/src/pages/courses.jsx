import { useEffect, useState } from "react";
import { Alert } from "../components/alert";
import Button from "../components/core/button";
import Coursecard from "../components/courseCard";
import { axiosClient } from "../utils/axiosClient";
import { useStateContext } from "../context/StateContext";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/core/pageComponent";

// Timeout of 5000ms is a delay for the backend nodemon to restart due to a change in the database
// TODO: Fix the timeout

export default function Courses() {
  const { user, courses, setCourses } = useStateContext();
  const [alert, setAlert] = useState({
    type: null,
    message: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchCourses = () => {
    setIsLoading(true);
    setAlert({ type: null, message: null });

    setTimeout(() => {
      axiosClient
        .get("/courses")
        .then(({ data }) => {
          if (!data) {
            setAlert({ type: "error", message: "Something went wrong" });
          }
          if (!data.success) {
            setAlert({ type: "error", message: data.message });
          } else {
            setCourses(data.courses);
            localStorage.setItem("courses", JSON.stringify(data.courses));
            setIsLoading(false);
          }
        })
        .catch((error) => {
          setAlert({
            type: "error",
            message: error.message || "Something went wrong",
          });
          setIsLoading(false);
        });
    }, 500);
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      fetchCourses();
    }, 2000);
  }, []);

  const handleDelete = (id) => {
    setAlert({ type: null, message: null });

    if (window.confirm("Are you sure you want to delete this course?")) {
      setTimeout(() => {
        debugger;
        axiosClient
          .delete(`/course/${id}`)
          .then(({ data }) => {
            debugger;
            if (!data.success) {
              setAlert({ type: "error", message: data.message });
            } else {
              setAlert({ type: "success", message: data.message });
              fetchCourses();
            }
          })
          .catch((error) => {
            setAlert({ type: "error", message: error.message });
          })
          .finally(() => {
            fetchCourses();
          });
      }, 500);
    }
  };

  return (
    <>
      {alert.type && <Alert type={alert.type} message={alert.message} />}
      <PageComponent
        title={"Courses"}
        buttons={
          user?.role !== "student" && (
            <Button color="green" to="/course/create">
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Create new
            </Button>
          )
        }
      >
        {isLoading ? (
          <div className="text-center text-lg">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {!isLoading && courses && courses.length > 0 ? (
              courses.map((course, _i) => {
                return (
                  <Coursecard
                    course={course}
                    key={_i}
                    onDelete={handleDelete}
                  />
                );
              })
            ) : (
              <div className="text-center text-lg font-medium flex items-center justify-center w-screen">
                No courses available
              </div>
            )}
          </div>
        )}
      </PageComponent>
    </>
  );
}
