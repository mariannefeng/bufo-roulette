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

export default function Game({sessionToken}) {
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
                code,
                sessionToken
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
                <div className='mt-10 text' style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                  <div>
                    Given an array of integers <code>array</code> and an integer <code>goal</code>, return indices of the two numbers such that they add up to goal.
                    You may assume that each input would have exactly one solution, and you may not use the same element twice.
                    You can return the answer in any order.
                    <div>
                      <br></br>
                      <b>Example 1:</b>

                      <br></br>
                      Input: array = <b>[2,7,11,15]</b>, goal = <b>9</b>
                      <br></br>
                      Output: <b>[0,1]</b>
                      <br></br>
                      Explanation: Because array[0] + array[1] == 9, we return <b>[0, 1]</b>.
                      <br></br>
                      <br></br>
                      We have provided the function definition for you, you just need to fill in the body.
                      <br></br>
                      <br></br>
                    </div>
                  </div>
                </div>

                <pre>{`const twoSum = (array, goal) => { `}</pre>
                <CodeEditor
                    value={code}
                    language="ts"
                    minHeight={300}
                    onChange={(evn) => setCode(evn.target.value)}
                    placeholder="return [0, 0];"
                />
                <pre>{`}`}</pre>

                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                  <div className='mt-10 text' style={{flexBasis: '80%'}}>
                      <p>When you submit this code, if it does not succeed and pass all test cases, 2418 bufos will be uploaded to your Zulip instance using your identity.</p>
                      <p>Currently there is a bug in Zulip's emoji upload endpoint that causes this to be an n² operation - all bufos get downloaded for each successful bufo emoji. With 2418 bufos, that's about <b>5.7 million image downloads.</b></p>
                      <p>This will <b>COMPLETELY lock up your Zulip instance for several hours.</b></p>
                      <p>Worse than that, you will receive a polite but stern DM from a real person at Zulip.</p>
                      <p><b>PLEASE</b> be certain that you want to do this.</p>
                  </div>

                  <div className='mt-10 text-right'>
                      <button className="rounded-md bg-bufo-dark hover:bg-bufo-light hover:text-black text-white px-2 py-1 cursor-pointer" onClick={fuckMeUp}>
                          ship it <img src={bufoShip} />
                      </button>
                  </div>
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
