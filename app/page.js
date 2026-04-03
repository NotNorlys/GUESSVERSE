"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [players, setPlayers] = useState([""]);
  const router = useRouter();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return (
    <div style={{textAlign:"center", padding:20}}>
      <h1>🎬 GuessVerse</h1>

      {players.map((p,i)=>(
        <input key={i}
          placeholder={"Jugador "+(i+1)}
          style={{display:"block", margin:"10px auto", padding:12}}
          onChange={(e)=>{
            const copy=[...players];
            copy[i]=e.target.value;
            setPlayers(copy);
          }}
        />
      ))}

      <button onClick={()=>setPlayers([...players,""])}>➕</button>

      <br/><br/>

      <button
        style={{background:"#e50914", color:"white", padding:15}}
        onClick={()=>{
          localStorage.setItem("players",JSON.stringify(players));
          router.push("/game");
        }}
      >
        🎮 Jugar
      </button>
    </div>
  );
}
