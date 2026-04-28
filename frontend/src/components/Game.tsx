import CodeEditor from '@uiw/react-textarea-code-editor';
import bufoLock from '../assets/bufo-lock.png'
import bufoShip from '../assets/bufo-ship.png'
import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Game() {
    const [code, setCode] = useState("");
    const [success, setSuccess] = useState<undefined | boolean>();

    const fuckMeUp = () => {
        const confirmed = window.confirm("Are you ready?");

        if (!confirmed) {
            return
        }

        console.log('inside of fuck me up')

        fetch(`${API_URL}/fuck-me-up`, {
            method: "POST",
            headers: {
                "Content-Type": "Application/JSON",
            },
            body: JSON.stringify(code),
        })
            .then((response: Response) => {
                if (!response.ok) {
                    throw new Error("Failed validation")
                }

                return response.json()
            }).then((resp) => {
                console.log('json response', resp)
                setSuccess(true);
            })
            .catch((error) => {
                console.log(error);
                setSuccess(false);
            });
    }

    return <section>
        {success === undefined &&
            <>
                <div className="flex justify-center"><img src={bufoLock} /></div>
                <pre>{`const twoSum = (array, goal) => { `}</pre>
                <CodeEditor
                    value={code}
                    language="ts"
                    minHeight={300}
                    onChange={(evn) => setCode(evn.target.value)}
                />
                <pre>{`}`}</pre>

                <div className='mt-10 text-right'>
                    <button className="rounded-md bg-bufo-dark hover:bg-bufo-light hover:text-black text-white px-2 py-1 cursor-pointer" onClick={fuckMeUp}>
                        ship it <img src={bufoShip} />
                    </button>
                </div>
            </>}
        {success !== undefined && success === true && <div>success! you're not bad, kid</div>}
        {success !== undefined && success === false && <div>rip zulip</div>}
    </section>
}