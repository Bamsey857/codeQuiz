import { useState, useEffect } from "react";
import { Alert } from "../components/alert";
import { useNavigate } from "react-router-dom";
import Coursecard from "../components/courseCard";
import { axiosClient } from "../utils/axiosClient";
import { useStateContext } from "../context/StateContext";
import PageComponent from "../components/core/pageComponent";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useStateContext();
  const [myCourses, setMyCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: null, message: null });

  const fetchMine = () => {
    setIsLoading(true);
    axiosClient
      .get("/courses/user")
      .then(({ data }) => {
        setMyCourses(data.courses);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
  if (user && user.role !== "student") {
      fetchMine();
    }
  }, []);

  return (
    <PageComponent title={user ? `Welcome ${user.name.split(" ")[0]}` : ""}>
      {alert.type && <Alert type={alert.type} message={alert.message} />}
      {user && user.role === "student" ? (
        <>
          <div className="text-center text-balance text-lg font-medium flex flex-col items-center justify-center w-screen">
            <span>Student Dashboard Analytics in progress ....</span>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {myCourses && myCourses.length > 0 ? (
            myCourses.map((course, _i) => {
              return <Coursecard course={course} key={_i} />;
            })
          ) : (
            <div className="text-center text-lg font-medium flex items-center justify-center w-screen">
              You don't have any courses yet.
            </div>
          )}
        </div>
      )}
    </PageComponent>
  );
}
