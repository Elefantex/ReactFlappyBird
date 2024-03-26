import React, { useEffect, useState } from "react";

export default function GameOver({ restarted, onRestart, level }) {
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0)
    const [rest, setRest] = useState(false)
    useEffect(() => {
        setRest(restarted)
    }, [restarted])

    useEffect(() => {
        const points = JSON.parse(localStorage.getItem('score'));
        const highPoints = JSON.parse(localStorage.getItem('highScore'));

        if (points !== null && highPoints !== null) {
            setScore(points);
            setHighScore(highPoints);
        }
    }, []);
    const [difficulty, setDifficulty] = useState(level)
    const restart = (value) => {
        setDifficulty(value)

        onRestart(value);


    };
    useEffect(() => {
        setDifficulty(level)
    }, [level])

    return (
        <>
            <div tabIndex="99" className="gameOver">
                <div className="containerPadre">
                    <div style={{ borderRadius: "7px", border: '#543847 1px solid', backgroundColor: '#DED895', width: "fit-content", margin: "5px" }} className="" >
                        <div className="container">
                            <div className="text">
                                Score
                            </div>
                            <div className="scoreText">
                                {score}
                            </div>
                            <div className="text">
                                Best
                            </div>
                            <div className="scoreText">
                                {highScore}
                            </div>
                        </div>


                    </div>
                    <div style={{ borderRadius: "7px", border: '#543847 1px solid', backgroundColor: '#DED895', width: "fit-content", margin: "5px" }} className="" >
                        <div className="container">
                            <div className="text">
                                Level
                            </div>
                            <div className="text">
                                <button className={difficulty === 0.5 ? "restartBtn " : "restartBtn clicked"} onClick={() => restart(0.5)}>Easy</button>

                            </div>
                            <div className="text">
                                <button className={difficulty === 1 ? "restartBtn " : "restartBtn clicked"} onClick={() => restart(1)}>Normal</button>

                            </div>
                            <div className="text">
                                <button className={difficulty === 1.5 ? "restartBtn " : "restartBtn clicked "} onClick={() => restart(1.5)}>Hard</button>

                            </div>
                        </div>


                    </div>
                </div>


                <button className="restartBtn" onClick={() => restart(level)} >RESTART</button>


            </div>

        </>
    )
}