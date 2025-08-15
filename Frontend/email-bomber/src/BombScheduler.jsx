
import { useState } from "react";
import "./BombScheduler.css";
import axios from "axios";

export default function BombScheduler() {
  const [email, setEmail] = useState("");
  const [time, setTime] = useState(5);
  const [bombs, setBombs] = useState(5);
  const [timeOpen, setTimeOpen] = useState(false);
  const [bombsOpen, setBombsOpen] = useState(false);

  const timeOptions = Array.from({ length: (600 - 5) / 5 + 1 }, (_, i) => 5 + i * 5);
  const bombOptions = Array.from({ length: 26 }, (_, i) => 5 + i);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, time, bombs };
    await axios.post(import.meta.env.VITE_API_URL, data);
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
        />
        <label>Time Interval (seconds)</label>
        <div className="dropdown">
          <div
            className="dropdown-selected"
            onClick={() => setTimeOpen(!timeOpen)}
          >
            {time} sec
          </div>
          {timeOpen && (
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
            onClick={() => setBombsOpen(!bombsOpen)}
          >
            {bombs}
          </div>
          {bombsOpen && (
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

        <button type="submit">Bomb Emails</button>
      </form>
    </div>
  );
}
