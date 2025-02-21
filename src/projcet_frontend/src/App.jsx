import { useState } from "react";
import { projcet_backend } from "declarations/projcet_backend";
import "./output.css";

function App() {
  const [greeting, setGreeting] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    projcet_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <img src="/logo2.svg" alt="DFINITY logo" className="w-64 mb-4" />
      
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4"
      >
        <label htmlFor="name" className="text-lg">
          Enter your name:
        </label>
        <input
          id="name"
          type="text"
          className="p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-200 hover:bg-red-200 text-white rounded-lg transition"
        >
          Click Me!
        </button>
      </form>

      <section id="greeting" className="mt-6 text-xl font-semibold">
        {greeting}
      </section>
    </main>
  );
}

export default App;
