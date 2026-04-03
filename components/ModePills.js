export default function ModePills({ selectedModes, toggleMode }) {
  const items = [
    ["emoji", "😀 Emojis"],
    ["frase", "💬 Frases"],
    ["personaje", "🎭 Personajes"]
  ];

  return (
    <div className="grid2 mt16">
      {items.map(([key, label]) => (
        <button
          key={key}
          type="button"
          className={`modeToggle ${selectedModes.includes(key) ? "active" : ""}`}
          onClick={() => toggleMode(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}