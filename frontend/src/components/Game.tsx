import CodeEditor from '@uiw/react-textarea-code-editor';
import bufoLock from '../assets/bufo-lock.png'
import bufoShip from '../assets/bufo-ship.png'
import bufoWipeSweat from '../assets/bufo-wipes-sweat.png'
import bufoCry1 from '../assets/bufo-cry/1.png'
import bufoCry2 from '../assets/bufo-cry/2.png'
import bufoCry3 from '../assets/bufo-cry/3.png'
import bufoCry4 from '../assets/bufo-cry/4.png'
import bufoCry5 from '../assets/bufo-cry/5.png'
import { useEffect, useState } from 'react';

const BUFO_CRY_IMAGES = [bufoCry1, bufoCry2, bufoCry3, bufoCry4, bufoCry5];

type FallingBufo = { id: number; img: string; left: string; duration: string };

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Game() {
    const [code, setCode] = useState("");
    const [success, setSuccess] = useState<undefined | boolean>();
    const [fallingBufos, setFallingBufos] = useState<FallingBufo[]>([]);

    useEffect(() => {
        if (success !== false) return;

        const interval = setInterval(() => {
            setFallingBufos(prev => [...prev, {
                id: Date.now(),
                img: BUFO_CRY_IMAGES[Math.floor(Math.random() * BUFO_CRY_IMAGES.length)],
                left: `${Math.random() * 95}%`,
                duration: `${1.2 + Math.random() * 1.5}s`,
            }]);
        }, 10);

        return () => clearInterval(interval);
    }, [success]);

    const fuckMeUp = () => {
        const confirmed = window.confirm("Are you sure?");

        if (!confirmed) {
            return
        }

        console.log('inside of fuck me up')

        fetch(`${API_URL}/fuck-me-up`, {
            method: "POST",
            headers: {
                "Content-Type": "Application/JSON",
            },
            body: JSON.stringify({
                code
            }),
        })
            .then((response: Response) => {
                if (!response.ok) {
                    throw new Error("Failed validation")
                }

                return response.text()
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
        {success !== undefined && success === true && <div className="flex justify-center flex-col text-center"><img src={bufoWipeSweat} /></div>}
        {success !== undefined && success === false && (
            <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                {fallingBufos.map(({ id, img, left, duration }) => (
                    <img
                        key={id}
                        src={img}
                        style={{
                            position: 'absolute',
                            left,
                            top: '-100px',
                            animation: `bufo-fall ${duration} linear`,
                        }}
                        onAnimationEnd={() => setFallingBufos(prev => prev.filter(b => b.id !== id))}
                    />
                ))}
            </div>
        )}
    </section>
}
