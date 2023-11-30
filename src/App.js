import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import Popup from "./components/Popup";

function App() {
  const [step, setStep] = useState("login");
  const [isPopupOpen, setPopupOpen] = useState(true);
  const [messageFromServer, setMessageFromServer] = useState("");
  const [ipLastNumber, setIpLastNumber] = useState("");
  const ws = useRef(null)
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => {
      console.log("Connected to server");
      ws.send("Hello from client");
    };

    ws.onmessage = (event) => {
      console.log("Received from server:", event.data);
      setMessageFromServer(event.data);

      setPopupOpen(true);
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
      ws.current.send('Hello from React!');
    }
  };

  const handleLogin = () => {
    ws.onopen = () => {
      ws.send(`Ip: ${ipLastNumber}`);
    };
    setStep("popup");
  };

  const handleClosePopup = () => {
    setStep("main");
  };

  return (
    <div className="App">
      <header className="App-header">
        {step === "login" && (
          <div>
            <label htmlFor="ipLastNumber">Ip last number:</label>
            <input
              type="number"
              id="ipLastNumber"
              value={ipLastNumber}
              onChange={(e) => setIpLastNumber(e.target.value)}
            />
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
