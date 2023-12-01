import React from "react";
import crosshair from "../icons/crosshair.svg";

const Popup = ({ onClose }) => {
  return (
    <div className=" fixed top-0 left-0 w-full h-full bg-gray-200/75 flex justify-center items-center">
      <div className="p-5 space-y-5">
        <h1 className="text-red-600 font-semibold text-4xl">
          This game is a good old fashioned western duel !
        </h1>
        <div className=" flex w-full items-center justify-center">
          <img src={crosshair} alt="crosshair" className=" w-52 h-auto" />
        </div>
        <div className=" justify-normal">
          <p>
            When you or your opponent are ready, click on Start game button and
            the game will start !
          </p>
        </div>
        <div className="rounded-lg border-l-8 border-yellow-500 bg-yellow-50 justify-center items-start">
          <p>
            After the countdown is finish, you'll have to press the space bar.
          </p>
          <p>
            The quickest player win and live while the other lose and die in
            unthinkable suffering
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-full px-4 py-2 border-red-500 border-2 hover:bg-red-500 hover:border-red-500 hover:cursor-pointer  "
        >
          Start game
        </button>
      </div>
    </div>
  );
};

export default Popup;
