import React from "react";

const Popup = ({ onClose }) => {
  return (
    <div className=" fixed top-0 left-0 w-full h-full bg-gray-200/75 flex justify-center items-center">
      <div className="p-5 rounded-md">
        <p>Contenu de la popup</p>
        <button
          onClick={onClose}
          className="rounded-lg px-4 py-2 border-grey-500 border-2 hover:bg-red-500 hover:border-red-500 hover:cursor-pointer  "
        >
          {" "}
          Start game
        </button>
      </div>
    </div>
  );
};

export default Popup;
