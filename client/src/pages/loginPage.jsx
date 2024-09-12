import React, { useState } from "react";
import { Input } from "../components/input";
import { Alert } from "../components/alert";
import { axiosClient } from "../utils/axiosClient";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState({
    type: null,
    message: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAlert({
      type: null,
      message: null,
    });

    setTimeout(async () => {
      try {
        const { data } = await axiosClient.post("/login", formData);
        if (!data.success) {
          setAlert({
            type: "error",
            message: data.message || "Something went wrong, try again",
          });
        } else {
          setAlert({
            type: "success",
            message: data.message,
          });
          localStorage.setItem("token", data.token);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (error) {
        setAlert({
          type: "error",
          message: error.message || "Something went wrong, try again",
        });
      }
    }, 500);
  };
  return (
    <>
      {alert.type && <Alert type={alert.type} message={alert.message} />}
      <div
        id="signin"
        className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center"
      >
        <form
          className="relative flex flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="relative grid mx-4 mb-4 -mt-6 overflow-hidden text-white shadow-lg h-28 place-items-center rounded-xl bg-gradient-to-tr from-gray-900 to-gray-800 bg-clip-border shadow-gray-900/20">
            <h3 className="block font-sans text-3xl antialiased font-semibold leading-snug tracking-normal text-white">
              Sign In
            </h3>
          </div>
          <div className="flex flex-col gap-4 p-6">
            <Input
              label={"Email"}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder={"JohnDoe1@exampleMail.com"}
              type={"email"}
              value={formData.email}
            />
            <Input
              label={"Password"}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder={"**********"}
              type={"password"}
              value={formData.password}
            />
            <div className="-ml-2.5"></div>
          </div>
          <div className="p-6 pt-0">
            <button
              className="block w-full select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="submit"
              id="submit"
            >
              Sign In
            </button>
            <p className="flex justify-center mt-6 font-sans text-sm antialiased font-light leading-normal text-inherit">
              Don't have an account?
              <a
                href="/register"
                className="block ml-1 font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900"
              >
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
