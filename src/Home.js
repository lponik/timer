// cd timer
import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Import CSS for video background styling

const Home = () => {
  const [inputTime, setInputTime] = useState("");   
  const [time, setTime] = useState(0);   
  const [isRunning, setIsRunning] = useState(false);  
  const [initialTime, setInitialTime] = useState(0);
  const [intervalMinutes, setIntervalMinutes] = useState("");  
  const [intervalCounter, setIntervalCounter] = useState(0);
  const soundRef = useRef(null);
  const [theme, setTheme] = useState("default");

  useEffect(() => {
    let timer = null;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
        if (intervalCounter > 0) {
          setIntervalCounter((prevCounter) => prevCounter - 1);
        } else if (intervalCounter === 0 && intervalMinutes > 0) {
          if (soundRef.current) soundRef.current.play();
          setIntervalCounter(intervalMinutes * 60);
        }
      }, 1000);
    } else if (time === 0) {
      clearInterval(timer);
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, time, intervalCounter, intervalMinutes]);

  const handleStart = () => {
    if (time > 0) {
      setIsRunning(true);
      setIntervalCounter(intervalMinutes * 60);
    }
  };

  const handleStop = () => setIsRunning(false);

  const handleSet = () => {
    const totalSeconds = parseInt(inputTime, 10) * 60;
    setTime(totalSeconds);
    setInitialTime(totalSeconds);
    setIntervalCounter(intervalMinutes * 60);
  };

  const handleReset = () => {
    setTime(initialTime);
    setIsRunning(false);
  };

  const handleInputChange = (e) => setInputTime(e.target.value);
  const handleIntervalChange = (e) => setIntervalMinutes(e.target.value);
  const handleThemeChange = (e) => setTheme(e.target.value);

  return (
    <div className="outer-container">
      <div className={`app-container ${theme === 'campfire' ? 'campfire-theme' : ''}`}>
        {/* Timer Display (Centered) */}
        <div className="timer-display">
          {Math.floor(time / 60)}:{time % 60 < 10 ? `0${time % 60}` : time % 60}
        </div>

        {/* Theme Selector */}
        <select
          onChange={handleThemeChange}
          value={theme}
          className="theme-selector"
        >
          <option value="default">Default Theme</option>
          <option value="campfire">Campfire Theme</option>
        </select>

        {/* Conditionally Render Inputs and Set Button */}
        {!isRunning && (
          <>
            {/* Input fields for time and interval */}
            <div className="input-container">
              <input
                type="number"
                placeholder="Duration (Mins)"
                value={inputTime}
                onChange={handleInputChange}
                className={theme === 'campfire' ? 'light-text' : ''}
              />
              <input
                type="number"
                placeholder="Interval (Mins)"
                value={intervalMinutes}
                onChange={handleIntervalChange}
                className={theme === 'campfire' ? 'light-text' : ''}
              />
            </div>

            {/* Set button */}
            <div style={{ marginBottom: '5px' }}>
              <button onClick={handleSet}>Set</button>
            </div>
          </>
        )}

        {/* Buttons container */}
        <div className="buttons-container">
          <button onClick={handleStart}>Start</button>
          <button onClick={handleStop}>Stop</button>
          <button onClick={handleReset}>Reset</button>
        </div>

        {/* Audio element for playing the sound */}
        <audio ref={soundRef}>
          <source src="/ring.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        {/* Background Video (only if not default) */}
        {theme !== 'default' && (
          <video autoPlay loop muted className="background-video">
            <source src={`/${theme}.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
};

export default Home;
