"use client";
import { useEffect, useState } from "react";
import { questions } from "../../data/questions";

const modes=["emoji","frase","personaje"];

export default function Game(){
  const [players,setPlayers]=useState([]);
  const [scores,setScores]=useState({});
  const [turn,setTurn]=useState(0);
  const [mode,setMode]=useState("emoji");
  const [index,setIndex]=useState(0);

  useEffect(()=>{
    const p=JSON.parse(localStorage.getItem("players"))||[];
    setPlayers(p);

    const s={};
    p.forEach(x=>s[x]=0);
    setScores(s);

    spin();
  },[]);

  const spin=()=>{
    const m=modes[Math.floor(Math.random()*modes.length)];
    setMode(m);
  };

  const filtered=questions.filter(q=>q.type===mode);
  const q=filtered[index];
  const player=players[turn];

  const next=()=>{
    setTurn((turn+1)%players.length);
    setIndex(index+1);
    spin();
  };

  const correct=()=>{
    const copy={...scores};
    copy[player]+=1;
    setScores(copy);
    next();
  };

  const skip=()=> next();

  if(!q){
    return(
      <div style={{textAlign:"center"}}>
        <h1>🏆 Ganador</h1>
        {Object.entries(scores).map(([k,v])=>(
          <h2 key={k}>{k}: {v}</h2>
        ))}
      </div>
    );
  }

  return(
    <div style={{textAlign:"center",padding:20}}>
      <h2>Turno: {player}</h2>
      <h3>Modo: {mode}</h3>

      <div style={{fontSize:50, padding:30, background:"#222"}}>
        {q.clue}
      </div>

      <button onClick={correct}>✅</button>
      <button onClick={skip}>⏭️</button>
      <button onClick={next}>❌</button>
    </div>
  );
}
