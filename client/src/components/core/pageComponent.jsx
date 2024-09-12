import React from "react";

export default function PageComponent({ children, title, buttons = "" }) {
  return (
    <>
      <header className="bg-white shadow">
        <div className="flex items-center justify-between mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>
          {buttons}
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 dark:bg-gray-900 overflow-x-hidden">
          {children}
        </div>
      </main>
    </>
  );
}
