import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import Popup from "./components/Popup";
import crosshair from "./icons/crosshair.svg";

function App() {
  const [step, setStep] = useState("login");
  const [messageFromServer, setMessageFromServer] = useState("");
  const [ipLastNumber, setIpLastNumber] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [countdownFinished, setCountdownFinished] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [spaceBarClicked, setSpaceBarClicked] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [chronometerIntervalId, setChronometerIntervalId] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(`ws://192.168.34.120:4000`);

    ws.current.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.current.onmessage = (event) => {
      console.log(`Received: ${event.data}`);
      // Handle the received message from the WebSocket server
    };

    ws.current.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error.message);
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send("Hello from React!");
    }
  };

  const sendReadiness = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ route: "readiness", data: true }));
    }
  };
  console.log();

  const sendReactionTime = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ route: "reaction-time", data: elapsedTime })
      );
    }
  };

  const handleLogin = () => {
    if (
      ipLastNumber &&
      /^\d+$/.test(ipLastNumber) &&
      ws.current &&
      ws.current.readyState === WebSocket.OPEN
    ) {
      ws.current.send(JSON.stringify({ route: "ip", data: ipLastNumber }));
      setStep("popup");
    } else {
      alert("Please enter a valid ip number or start your server");
    }
  };

  const handleClosePopup = () => {
    setStep("main");
    setCountdown(5);
    setCountdownFinished(false);
    setSpaceBarClicked(false);
  };

  const handleStartGame = () => {
    setStep("main");
    setGameStarted(true);
    setCountdown(5);
    setElapsedTime(0);
    const id = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1);
    setChronometerIntervalId(id);
    setCountdownFinished(false);

    setTimeout(() => {
      clearInterval(id);
      setCountdownFinished(true);
    }, 5000);
  };

  useEffect(() => {
    let timer;

    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && gameStarted) {
      setCountdownFinished(true);
      console.log("Game starts!");
    }

    return () => {
      clearTimeout(timer);
    };
  }, [countdown, gameStarted]);

  const startChronometer = (startTime) => {
    const chronometerIntervalId = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      setElapsedTime(elapsedTime);
    }, 10);

    setChronometerIntervalId(chronometerIntervalId);
  };

  const handleSpaceKeyPress = (e) => {
    if (e.code === "Space" && countdownFinished && !spaceBarClicked) {
      setSpaceBarClicked(true);
      clearInterval(chronometerIntervalId);
      sendReactionTime();
      console.log("Space key pressed after countdown");
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleSpaceKeyPress);
    return () => {
      window.removeEventListener("keydown", handleSpaceKeyPress);
    };
  }, [countdownFinished, spaceBarClicked]);

  return (
    <div className="App">
      <header className="App-header">
        {step === "login" && (
          <div className="fixed w-1/2 top-48 h-1/2 justify-center items-center bg-white/60 p-10 rounded-lg">
            <div className="w-full left-0 space-y-2">
              <h1 className="text-6xl text-red-600 font-bold">Lucky Loris</h1>
              <p className="text-xs">c'est pas moi qui ai trouvé le nom</p>
            </div>
            <div className="flex w-full items-center justify-center">
              <img src={crosshair} alt="crosshair" className="w-52 h-auto" />
            </div>
            <div className="flex gap-x-5 items-center justify-center">
              <div className="relative w-80">
                <label
                  htmlFor="ipLastNumber"
                  className="absolute bottom-0 left-0 top-0 flex w-auto px-5"
                >
                  Ip last number:
                </label>
                <input
                  type="text"
                  id="ipLastNumber"
                  value={ipLastNumber}
                  onChange={(e) => setIpLastNumber(e.target.value)}
                  className="pl-56 h-11 w-full rounded-full border border-red-500 px-3 outline-none hover:border-green-water-500 hover:bg-gray-200 ring-red-500 ring-opacity-60 focus:ring"
                />
              </div>
              <button
                onClick={handleLogin}
                className="px-5 relative flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-red-500 border-2 hover:bg-red-500 hover:border-red-500 hover:cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>
        )}

        {step === "popup" && (
          <Popup
            onClose={handleClosePopup}
            onStartGame={handleStartGame}
            isReady={sendReadiness}
          />
        )}

        {step === "main" && (
          <div>
            {countdown !== null && countdown !== 0 && (
              <div className="text-8xl text-white">
                <p>{countdown}</p>
              </div>
            )}
            {(countdown !== null && countdown === 0) ||
              (!spaceBarClicked && countdown !== null && (
                <div className="text-8xl text-white">
                  <p>Press space bar !</p>
                </div>
              ))}
            {spaceBarClicked && (
              <div>
                <div className="flex w-full items-center justify-center">
                  <img
                    src={crosshair}
                    alt="crosshair"
                    className="w-52 h-auto"
                  />
                </div>
                <div className="text-2xl text-white">
                  <p>Elapsed time: {elapsedTime} ms</p>
                </div>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
