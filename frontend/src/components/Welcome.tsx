import { useState } from 'react'
import bufoFight from '../assets/bufo-fight.gif'
import bufoDice from '../assets/bufo-dice.png'


export default function Welcome({ onSubmit }: { onSubmit: ({ }: { email: string, key: string, url: string }) => void }) {
    const [email, setEmail] = useState("")
    const [key, setKey] = useState("")
    const [url, setURL] = useState("")

    return (
        <section className="mt-20">
            <div className="flex justify-center items-baseline gap-2"><img src={bufoDice} />Welcome to bufo roulette. To get started, we'll need your:</div>
            <div className="flex flex-col items-center mt-10 gap-3">
                <input className="border-2 border-gray-300 rounded-md p-1" type="email" value={email} placeholder="Your Zulip email" onChange={(event) => setEmail(event.target.value)} />
                <input className="border-2 border-gray-300 rounded-md p-1" type="text" value={key} placeholder="Your Zulip API Key" onChange={(event) => setKey(event.target.value)} />
                <input className="border-2 border-gray-300 rounded-md p-1" type="url" value={url} placeholder="Your Zulip URL" onChange={(event) => setURL(event.target.value)} />
            </div>

            <div className="mt-5 text-right">
                {email !== "" && key !== "" && url != "" && <button className="rounded-md bg-bufo-dark hover:bg-bufo-light hover:text-black text-white px-2 py-1 cursor-pointer" onClick={(event) => {
                    event.preventDefault();
                    onSubmit({ email, key, url });
                }}>Let me at it!<img src={bufoFight} /></button>}
            </div>
        </section>
    )
}