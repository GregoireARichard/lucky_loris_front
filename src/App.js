import "./App.css";
import React, { useEffect, useState } from "react";
import Popup from "./components/Popup";

function App() {
  const [step, setStep] = useState("login");
  const [isPopupOpen, setPopupOpen] = useState(true);
  const [messageFromServer, setMessageFromServer] = useState("");
  const [ipLastNumber, setIpLastNumber] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000"); // Remplacez par l'URL de votre serveur WebSocket

    ws.onopen = () => {
      console.log("Connected to server");
      ws.send("Hello from client"); // Envoyer un message au serveur
    };

    ws.onmessage = (event) => {
      console.log("Received from server:", event.data);
      setMessageFromServer(event.data);
      // Gérez les données reçues du serveur, par exemple, déclenchez l'ouverture de la popup
      setPopupOpen(true);
    };

    ws.onclose = () => {
      console.log("Disconnected from server");
    };

    return () => {
      ws.close(); // Fermez la connexion WebSocket lorsque le composant est démonté
    };
  }, []); // Effectuée uniquement lors du montage du composant

  const handleLogin = () => {
    const ws = new WebSocket("ws://localhost:3000");
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
