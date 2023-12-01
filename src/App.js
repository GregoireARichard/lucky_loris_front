import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import Popup from "./components/Popup";

function App() {
  const [step, setStep] = useState("login");
  const [messageFromServer, setMessageFromServer] = useState("");
  const [ipLastNumber, setIpLastNumber] = useState("");
  const ws = useRef(null);
  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:4000`);

    ws.current.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.current.onmessage = (event) => {
      console.log(`Received: ${event.data}`);
      // Handle the received message from the WebSocket server
    };

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error.message);
    };

    return () => {
      // Clean up WebSocket connection on component unmount
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      // Send a message to the WebSocket server
      ws.current.send('Hello from React!');
    }
  };

  const handleLogin = () => {
    if (ipLastNumber && /^\d+$/.test(ipLastNumber) && ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(`Ip: ${ipLastNumber}`); 
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
