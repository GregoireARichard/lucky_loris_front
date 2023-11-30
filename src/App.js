import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import Popup from "./components/Popup";

function App() {
  const [step, setStep] = useState("login");
  const [messageFromServer, setMessageFromServer] = useState("");
  const [ipLastNumber, setIpLastNumber] = useState("");
  const ws = useRef(null);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => {
      console.log("Connected to server");
      ws.send("Hello from client");
    };

    ws.onmessage = (event) => {
      console.log("Received from server:", event.data);
      setMessageFromServer(event.data);
      // Gérez les données reçues du serveur, par exemple, déclenchez l'ouverture de la popup
    };

    ws.onclose = () => {
      console.log("Disconnected from server");
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send("Hello from React!");
    }
  };

  const handleLogin = () => {
    if (ipLastNumber && /^\d+$/.test(ipLastNumber)) {
      const ws = new WebSocket("ws://localhost:3000");
      ws.onopen = () => {
        ws.send(`Ip: ${ipLastNumber}`);
      };
      setStep("popup");
    } else {
      alert("Please enter a valid ip number");
    }
  };

  const handleClosePopup = () => {
    setStep("main");
  };

  return (
    <div className="App">
      <header className="App-header">
        {step === "login" && (
          <div className="grid grid-rows-2">
            <div className=" border-gray-300 border-2 px-5 rounded-full space-x-2">
              <label htmlFor="ipLastNumber">Ip last number:</label>
              <input
                type="number"
                id="ipLastNumber"
                value={ipLastNumber}
                onChange={(e) => setIpLastNumber(e.target.value)}
                className="border-none w-24 outline-none"
              />
            </div>

            <button onClick={handleLogin}>Login</button>
            <button onClick={sendMessage}>Send Message</button>
          </div>
        )}

        {step === "popup" && <Popup onClose={handleClosePopup} />}

        {step === "main" && (
          <div>
            <p>this is the main page</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
