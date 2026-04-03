"use client";
import { useEffect, useMemo, useState } from "react";
import Timer from "../../components/Timer";
import { questions, dares, randomEvents } from "../../data/questions";

const shuffle = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export default function Game() {
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});
  const [enabledModes, setEnabledModes] = useState(["emoji", "frase", "personaje"]);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [roundQueue, setRoundQueue] = useState([]);
  const [turn, setTurn] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [eventText, setEventText] = useState("");
  const [message, setMessage] = useState("");
  const [timerResetKey, setTimerResetKey] = useState(0);

  useEffect(() => {
    const savedPlayers = JSON.parse(localStorage.getItem("gv_players") || '["Jugador 1"]');
    const savedModes = JSON.parse(localStorage.getItem("gv_modes") || '["emoji","frase","personaje"]');
    const savedTimer = JSON.parse(localStorage.getItem("gv_timer") || "true");

    setPlayers(savedPlayers);
    setEnabledModes(savedModes);
    setTimerEnabled(savedTimer);

    const initialScores = {};
    savedPlayers.forEach((p) => {
      initialScores[p] = 0;
    });
    setScores(initialScores);

    const filtered = questions.filter((q) => savedModes.includes(q.type));
    setRoundQueue(shuffle(filtered).slice(0, 12));
    setEventText(randomEvents[Math.floor(Math.random() * randomEvents.length)]);
  }, []);

  const currentPlayer = players[turn] || "";
  const currentQuestion = roundQueue[currentIndex];

  const sortedScores = useMemo(() => {
    return Object.entries(scores).sort((a, b) => b[1] - a[1]);
  }, [scores]);

  const nextTurn = () => {
    setShowAnswer(false);
    setMessage("");
    setCurrentIndex((v) => v + 1);
    setTurn((v) => (players.length ? (v + 1) % players.length : 0));
    setEventText(randomEvents[Math.floor(Math.random() * randomEvents.length)]);
    setTimerResetKey((v) => v + 1);
  };

  const givePoints = (basePoints) => {
    let extra = 0;
    if (eventText.includes("DOBLE")) extra += basePoints;
    if (eventText.includes("+1")) extra += 1;

    setScores((prev) => ({
      ...prev,
      [currentPlayer]: (prev[currentPlayer] || 0) + basePoints + extra
    }));
  };

  const handleCorrect = () => {
    if (!currentQuestion) return;
    givePoints(currentQuestion.points || 1);
    setMessage("✅ ¡Acertó!");
    setTimeout(nextTurn, 550);
  };

  const handleFail = () => {
    const dare = dares[Math.floor(Math.random() * dares.length)];
    if (eventText.includes("reto")) {
      setMessage("❌ Falló. Reto: " + dare);
    } else {
      setMessage("❌ Falló.");
    }
    setTimeout(nextTurn, 850);
  };

  const handleSkip = () => {
    setMessage("⏭️ Pregunta saltada");
    setTimeout(nextTurn, 450);
  };

  if (!roundQueue.length) {
    return (
      <main className="page">
        <section className="gameCard center">
          <div className="logo">🎬</div>
          <h1 className="title">Cargando partida...</h1>
        </section>
      </main>
    );
  }

  if (!currentQuestion) {
    const winner = sortedScores[0];
    return (
      <main className="page">
        <section className="gameCard">
          <div className="center">
            <div className="logo">🏆</div>
            <div className="resultWin">Ganador</div>
            {winner ? <h1 className="title" style={{ marginTop: 0 }}>{winner[0]}</h1> : null}
            {winner ? <p className="subtitle">con {winner[1]} puntos</p> : null}
          </div>

          <div className="scoreGrid mt20">
            {sortedScores.map(([name, points], index) => (
              <div className="scoreCard" key={name}>
                <div className="scoreName">
                  {index === 0 ? "🥇 " : index === 1 ? "🥈 " : index === 2 ? "🥉 " : "🎉 "}
                  {name}
                </div>
                <div className="scorePoints">{points}</div>
              </div>
            ))}
          </div>

          <div className="row mt20">
            <button
              className="button primary full"
              onClick={() => window.location.reload()}
            >
              🔄 Jugar otra vez
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="gameCard">
        <div className="badgeRow">
          <div className="chip">🎯 Turno: {currentPlayer}</div>
          <div className="chip">
            {currentQuestion.type === "emoji" ? "😀 Emoji" : currentQuestion.type === "frase" ? "💬 Frase" : "🎭 Personaje"}
          </div>
          <div className="chip">⭐ {currentQuestion.points} pts</div>
        </div>

        <div className="banner mt16">{eventText}</div>

        {timerEnabled ? (
          <Timer duration={12} resetKey={timerResetKey} onExpire={handleFail} />
        ) : null}

        <div className="hero mt20">{currentQuestion.clue}</div>

        <div className="center mt16">
          {!showAnswer ? (
            <button className="button blue" onClick={() => setShowAnswer(true)}>
              👀 Mostrar respuesta
            </button>
          ) : (
            <div className="chip">Respuesta: {currentQuestion.answer}</div>
          )}
        </div>

        {message ? (
          <div className="center mt16">
            <div className="chip">{message}</div>
          </div>
        ) : null}

        <div className="row mt20">
          <button className="button success full" onClick={handleCorrect}>
            ✅ Acertó
          </button>
          <button className="button warning full" onClick={handleSkip}>
            ⏭️ Saltar
          </button>
          <button className="button danger full" onClick={handleFail}>
            ❌ Falló
          </button>
        </div>

        <div className="mt20">
          <div className="chip">🏆 Marcador</div>
          <div className="scoreGrid mt12">
            {sortedScores.map(([name, points]) => (
              <div className="scoreCard" key={name}>
                <div className="scoreName">{name}</div>
                <div className="scorePoints">{points}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}