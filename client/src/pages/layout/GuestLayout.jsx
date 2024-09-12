import React, { useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/StateContext";

export default function GuestLayout({ children }) {
  const { token } = useStateContext();
  const location = useLocation();
  const navigate = useNavigate();
  const listItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Courses",
      link: "#",
    },
    {
      name: "Contact",
      link: "#",
    },
    {
      name: "About Us",
      link: "#",
    },
  ];

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);
  return (
    <div className="bg-gray-100 min-h-screen w-screen flex flex-col m-0 p-0 box-border overflow-x-hidden">
      <header className="bg-gradient-to-tr from-gray-900 to-gray-800 bg-clip-border shadow-gray-900/20 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <div className="text-white md:text-4xl sm:text-3xl text-2xl md:font-extrabold sm:font-bold font-semibold">
            CodeQuiz
          </div>
          <nav>
            <ul className="flex space-x-6 items-center justify-between">
              {listItems.map((item, _i) => (
                <li key={_i} className="max-sm:hidden">
                  <Link
                    to={item.link}
                    className={`text-white hover:text-gray-200 ${
                      location.pathname === item.link ? "underline" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <Link
                to={location.pathname === "/register" ? "/login" : "/register"}
                className="text-black"
              >
                <button className="bg-white p-2 rounded-lg  md:font-semibold sm:font-medium font-normal text-base sm:text-lg md:text-xl">
                  {location.pathname === "/register" ? "Login" : "Sign Up"}
                </button>
              </Link>
            </ul>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
