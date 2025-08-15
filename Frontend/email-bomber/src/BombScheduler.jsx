import { useState } from "react";
import "./BombScheduler.css";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BombScheduler() {
  const [email, setEmail] = useState("");
  const [time, setTime] = useState(5);
  const [bombs, setBombs] = useState(5);
  const [timeOpen, setTimeOpen] = useState(false);
  const [bombsOpen, setBombsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const timeOptions = Array.from({ length: (600 - 5) / 5 + 1 }, (_, i) => 5 + i * 5);
  const bombOptions = Array.from({ length: 26 }, (_, i) => 5 + i);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const data = { email, time, bombs };
    
    try {
      console.log("Sending request to:", import.meta.env.VITE_API_URL);
      console.log("Data:", data);
      
      const response = await axios.post(import.meta.env.VITE_API_URL, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });
      
      console.log("Response:", response.data);
      
      toast.success("Email Bombing Started 🚀", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Bounce,
      });
      
    } catch (err) {
      console.error("Error details:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      let errorMessage = "Something Went Wrong!";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Bomb Scheduler</h2>
      <form onSubmit={handleSubmit}>
        <label>Recipient Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter email"
          disabled={isLoading}
        />
        <label>Time Interval (seconds)</label>
        <div className="dropdown">
          <div
            className="dropdown-selected"
            onClick={() => !isLoading && setTimeOpen(!timeOpen)}
          >
            {time} sec
          </div>
          {timeOpen && !isLoading && (
            <div className="dropdown-options">
              {timeOptions.map((sec) => (
                <div
                  key={sec}
                  className="dropdown-option"
                  onClick={() => {
                    setTime(sec);
                    setTimeOpen(false);
                  }}
                >
                  {sec} sec
                </div>
              ))}
            </div>
          )}
        </div>

        <label>Number of Bombs</label>
        <div className="dropdown">
          <div
            className="dropdown-selected"
            onClick={() => !isLoading && setBombsOpen(!bombsOpen)}
          >
            {bombs}
          </div>
          {bombsOpen && !isLoading && (
            <div className="dropdown-options">
              {bombOptions.map((count) => (
                <div
                  key={count}
                  className="dropdown-option"
                  onClick={() => {
                    setBombs(count);
                    setBombsOpen(false);
                  }}
                >
                  {count}
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Launching..." : "Bomb Emails"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}