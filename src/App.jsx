import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function App() {
  const [dices, setDices] = React.useState(() => generateAllNewDices());
  const [finished, setFinished] = React.useState(false);
  const { width, height } = useWindowSize();

  React.useEffect(() => {
    checkIfWon();
  }, [dices]);

  function generateAllNewDices() {
    let allnewDices = [];

    for (let i = 0; i < 10; i++) {
      const randumber = Math.floor(Math.random() * 6 + 1);
      allnewDices.push({
        value: randumber,
        isHeld: false,
        id: nanoid(),
      });
    }
    return allnewDices;
  }

  const dicesBtns = dices.map((dieObject) => (
    <Die
      key={dieObject.id}
      handleClick={() => {
        hold(dieObject.id);
        checkIfWon();
      }}
      value={dieObject.value}
      isHeld={dieObject.isHeld}
    />
  ));

  function rerollDices() {
    setDices((dices) =>
      dices.map((die) =>
        !die.isHeld ? { ...die, value: Math.floor(Math.random() * 6 + 1) } : die
      )
    );
  }

  function checkIfWon() {
    const allHeld = dices.every((die) => die.isHeld); // all dice must be held
    const firstValue = dices[0].value; // reference value
    const allSameValue = dices.every((die) => die.value === firstValue); // all dice must match

    if (allHeld && allSameValue) {
      setFinished(true); // mark game as finished
    }
  }

  function hold(id) {
    !finished &&
      setDices((dices) =>
        dices.map((die) =>
          die.id === id ? { ...die, isHeld: !die.isHeld } : die
        )
      );
  }

  function startNewGame() {
    if (finished) {
      setDices(generateAllNewDices());
      setFinished(false);
    }
  }

  return (
    <main>
      {finished && <Confetti width={width} height={height} />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>

      <div id="game-btns">{dicesBtns}</div>
      <button
        id="roll-btn"
        onClick={() => {
          rerollDices();
          startNewGame();
        }}
        style={{
          backgroundColor: finished && "black",
        }}
      >
        {finished ? "New Game" : "reroll"}
      </button>
    </main>
  );
}
