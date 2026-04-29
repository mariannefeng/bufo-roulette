import { useState } from 'react';
import './App.css'
import Welcome from './components/Welcome';
import Game from './components/Game';
import { useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || '';

function App() {
  const [eligibleToPlay, setEligibleToPlay] = useState(false);
  const [sessionToken, setSessionToken] = useState("");

  const startGame = (payload: any) => {
    fetch(`${API_URL}/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/JSON",
      },
      body: JSON.stringify(payload),
    })
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error("Failed validation")
        }

        return response.text()
      }).then((resp) => {
        console.log('json response', resp)
        setSessionToken(JSON.parse(resp)['session_token'])
        console.log(sessionToken);
        console.log({sessionToken});
        setEligibleToPlay(true)
      })
      .catch((error) => {
        console.log(error);
        alert("Oh no! Looks like your creds are trash")
      });

      console.log("foo");
      const session_token = sessionToken;
      console.log(session_token);
      const onBeforeUnload = (ev) => {
        
        //#############     
        console.log({sessionToken});
        //#############
        
        navigator.sendBeacon(`${API_URL}/chicken-out`, JSON.stringify({ session_token: {sessionToken} }));

        ev.returnValue = "Anything you wanna put here!";
        return "Anything here as well, doesn't matter!";
      };

      window.addEventListener("beforeunload", onBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", onBeforeUnload);
      };


  }

  return (
    <section>
      {!eligibleToPlay ? <Welcome onSubmit={startGame} /> : <Game sessionToken={sessionToken} />}
    </section>
  )
}

export default App
