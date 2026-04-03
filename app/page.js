"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ModePills from "../components/ModePills";

export default function Home() {
  const router = useRouter();
  const [players, setPlayers] = useState([""]);
  const [selectedModes, setSelectedModes] = useState(["emoji", "frase", "personaje"]);
  const [timerEnabled, setTimerEnabled] = useState(true);

  const updatePlayer = (value, index) => {
    const copy = [...players];
    copy[index] = value;
    setPlayers(copy);
  };

  const addPlayer = () => setPlayers((prev) => [...prev, ""]);

  const toggleMode = (mode) => {
    setSelectedModes((prev) => {
      if (prev.includes(mode)) {
        if (prev.length === 1) return prev;
        return prev.filter((m) => m !== mode);
      }
      return [...prev, mode];
    });
  };

  const startGame = () => {
    const cleanPlayers = players.map((p) => p.trim()).filter(Boolean);
    const finalPlayers = cleanPlayers.length ? cleanPlayers : ["Jugador 1"];
    localStorage.setItem("gv_players", JSON.stringify(finalPlayers));
    localStorage.setItem("gv_modes", JSON.stringify(selectedModes));
    localStorage.setItem("gv_timer", JSON.stringify(timerEnabled));
    router.push("/game");
  };

  return (
    <main className="page">
      <section className="card">
        <div className="center">
          <div className="logo">🎬</div>
          <h1 className="title">GuessVerse</h1>
          <p className="subtitle">
            Juego de fiesta para amigos y familia. Súper fácil, rápido y divertido.
          </p>
        </div>

        {players.map((player, index) => (
          <input
            key={index}
            className="input"
            placeholder={`Jugador ${index + 1}`}
            value={player}
            onChange={(e) => updatePlayer(e.target.value, index)}
          />
        ))}

        <div className="row mt12">
          <button className="button secondary full" onClick={addPlayer}>
            ➕ Añadir jugador
          </button>
        </div>

        <div className="mt20 center">
          <div className="chip">🎮 Elige modos</div>
        </div>

        <ModePills selectedModes={selectedModes} toggleMode={toggleMode} />

        <div className="row mt16">
          <button
            type="button"
            className={`button full ${timerEnabled ? "purple" : "secondary"}`}
            onClick={() => setTimerEnabled((v) => !v)}
          >
            {timerEnabled ? "⏱️ Tiempo activado" : "⏱️ Tiempo desactivado"}
          </button>
        </div>

        <div className="mt20">
          <button className="button primary full" onClick={startGame}>
            🚀 Empezar partida
          </button>
        </div>

        <p className="small center mt16">
          Incluye modos, saltar pregunta, eventos locos y retos para reírse.
        </p>
      </section>
    </main>
  );
}