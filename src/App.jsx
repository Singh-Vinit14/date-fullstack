import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess(false);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          dob: dob,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Saved user:", data.user);

        setSuccess(true);

        // Form clear
        setName("");
        setDob("");
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Unable to connect to the server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold text-center mb-2">
          User Information
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Please enter your details
        </p>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSuccess(false);
              setError("");
            }}
            className="w-full border border-gray-300 rounded-lg p-3 mb-5 outline-none focus:ring-2 focus:ring-black"
            required
          />

          {/* Date of Birth */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>

          <input
            type="date"
            value={dob}
            onChange={(e) => {
              setDob(e.target.value);
              setSuccess(false);
              setError("");
            }}
            className="w-full border border-gray-300 rounded-lg p-3 mb-6 outline-none focus:ring-2 focus:ring-black"
            required
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Submit
          </button>

        </form>

        {/* Success Message */}
        {success && (
          <div className="mt-5 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            ✅ Data has been recorded successfully!
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-5 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            ❌ {error}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;