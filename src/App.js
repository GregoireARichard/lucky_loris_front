import "./App.css";
import React, { useState } from "react";
import Popup from "./components/Popup";

function App() {
  const [isPopupOpen, setPopupOpen] = useState(true);
  const [messageFromServer, setMessageFromServer] = useState("");

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

  const handleClosePopup = () => {
    setPopupOpen(false);
  };
  return (
    <div className="App">
      <header className="App-header">
        {isPopupOpen && <Popup onClose={handleClosePopup} />}
      </header>
    </div>
  );
}

export default App;
