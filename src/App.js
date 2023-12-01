import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import Popup from "./components/Popup";
import crosshair from "./icons/crosshair.svg";

function App() {
  const [step, setStep] = useState("login");
  const [messageFromServer, setMessageFromServer] = useState("");
  const [ipLastNumber, setIpLastNumber] = useState("");
  const ws = useRef(null);
  useEffect(() => {
    ws.current = new WebSocket(`ws://192.168.34.175:4000`);

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
      // Clean up WebSocket connection on component unmount
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      // Send a message to the WebSocket server
      ws.current.send("Hello from React!");
    }
  };

  const handleLogin = () => {
    console.log(ws.current, '______')
    if (
      ipLastNumber &&
      /^\d+$/.test(ipLastNumber)
      && ws.current &&
      ws.current.readyState === WebSocket.OPEN
    ) {
      ws.current.send(JSON.stringify({ route: 'ip', data: ipLastNumber }));
      setStep("popup");
    } else {
      alert("Please enter a valid ip number or start your server");
    }
  };

  const handleClosePopup = () => {
    setStep("main");
  };

  return (
    <div className="App">
      <header className="App-header">
        {step === "login" && (
          <div className="fixed w-full top-56 h-full   justify-center items-center">
            <div className="w-full left-0 space-y-2">
              <h1 className="text-6xl text-red-600 font-bold">Lucky Loris</h1>

              <p className="text-xs">c'est pas moi qui ai trouvé le nom</p>
            </div>
            <div className=" flex w-full items-center justify-center">
              <img src={crosshair} alt="crosshair" className=" w-52 h-auto" />
            </div>

            <div className="flex gap-x-5 items-center justify-center">
              <div className="relative w-80">
                <label
                  htmlFor="ipLastNumber"
                  className="absolute bottom-0 left-0 top-0 flex w-auto px-5  "
                >
                  Ip last number:
                </label>
                <input
                  type="texte"
                  id="ipLastNumber"
                  value={ipLastNumber}
                  onChange={(e) => setIpLastNumber(e.target.value)}
                  className=" pl-56 h-11 w-full rounded-full border border-red-500 px-3 outline-none hover:border-green-water-500 hover:bg-gray-200 ring-red-500 ring-opacity-60 focus:ring focus:hover:bg-transparent"
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

        {step === "popup" && <Popup onClose={handleClosePopup} />}

        {step === "main" && (
          <div>
            <div className=" flex w-full items-center justify-center">
              <img src={crosshair} alt="crosshair" className=" w-56 h-auto" />
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
