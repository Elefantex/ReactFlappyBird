import React, { useEffect, useState } from "react";

export default function GameOver({ restarted, onRestart }) {
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

    const restart = () => {
        // Aquí puedes realizar alguna lógica adicional si es necesario antes de reiniciar
        // Luego, llama a la función de devolución de llamada pasada desde el padre
        onRestart();
    };
    return (
        <>
            <div tabIndex="99" className="gameOver">
                <div style={{ borderRadius: "7px", border: '#543847 1px solid', backgroundColor: '#DED895', width: "fit-content" }} className="" >
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

                <button className="restartBtn" onClick={() => restart()} >RESTART</button>


            </div>

        </>
    )
}