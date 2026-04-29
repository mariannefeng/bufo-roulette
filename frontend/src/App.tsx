import { useState } from 'react';
import './App.css'
import Welcome from './components/Welcome';
import Game from './components/Game';

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
        setEligibleToPlay(true)
      })
      .catch((error) => {
        console.log(error);
        alert("Oh no! Looks like your creds are trash")
      });
  }

  return (
    <section>
      {!eligibleToPlay ? <Welcome onSubmit={startGame} /> : <Game sessionToken={sessionToken} />}
    </section>
  )
}

export default App
