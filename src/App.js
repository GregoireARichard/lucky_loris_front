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
          <div className="gap-y-2">
            <div className="absolute top-56 w-full left-0 space-y-2">
              <h1 className="text-6xl text-red-600 font-bold">Lucky Loris</h1>

              <p className="text-xs">c'est pas moi qui ai trouvé le nom</p>
            </div>
            <div className=" flex w-full items-center justify-center">
              <img
                src={crosshair}
                alt="crosshair"
                className="text-red-500 w-52 h-auto"
              />
            </div>

            <div className="flex gap-x-5">
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
                className="px-5 relative flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-grey-500 border-2 hover:bg-red-500 hover:border-red-500 hover:cursor-pointer"
              >
                Login
              </button>
            </div>
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
