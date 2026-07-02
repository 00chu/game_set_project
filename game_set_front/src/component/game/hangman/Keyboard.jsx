const KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Keyboard({
  guessedLetters,
  incorrectLetters,
  addGuessedLetter,
}) {
  return (
    <div className="keyboard">
      {KEYS.map((key) => {
        const active = guessedLetters.includes(key);
        const inactive = incorrectLetters.includes(key);

        return (
          <button
            key={key}
            disabled={active || inactive}
            className={active ? "active" : inactive ? "inactive" : ""}
            onClick={() => addGuessedLetter(key)}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}
