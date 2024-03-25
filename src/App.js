import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import "./estilos/estilos.css"
import GameOver from './estilos/GameOver';



function App() {

  let heightScreen = window.innerHeight;
  let widthScreen = window.innerWidth;
  const miDiv = useRef();
  const [tubes, setTubes] = useState([]);

  const [bottom, setBottom] = useState(heightScreen / 2);
  const [play, setPlay] = useState(true);
  const [gameStarted, setGameStarted] = useState(false)

  const [rotate, setRotate] = useState(0)


  let velocity = 3


  const jump = () => {
    setPlay(true)
    setGameStarted(true)
    //setRotate(-20)
    if (bottom < heightScreen) {
      requestAnimationFrame(() => {
        setBottom((prevAltura) => prevAltura + 120);
        let dif = rotate - 20
        //setRotate(rotate + dif)
      });
    }
  };



  const restart = () => {
    setPlay(true)
    setScore(0)
    setBottom((heightScreen / 2) - 50)
    setRotate(-50)
    setTubes([])
  }


  const handler = (e) => {
    if (play && !e.isComposing && (e.keyCode === 32 || e.type === 'click')) {
      if (bottom < heightScreen) {
        jump();
      }

    }
    if (!play && !e.isComposing && e.keyCode === 82) {
      restart()
    }

  };

  useEffect(() => {
    window.addEventListener('keydown', handler);
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('click', handler);
    };
  }, [play, bottom]);




  const caida = () => {
    requestAnimationFrame(() => {
      if (bottom > 15 * heightScreen / 100) {
        const newVelocity = velocity; // Simula la aceleración debida a la gravedad
        const newBottom = bottom - newVelocity;
        setBottom(newBottom > 15 * heightScreen / 100 ? newBottom : 15 * heightScreen / 100); // Limita la posición inferior
        const newRotation = rotate + 1; // Puedes ajustar el valor de aumento según la velocidad deseada
        setRotate(newRotation > 90 ? 90 : newRotation); // Limitar la rotación a 180 grados

      } else {
        setPlay(false); // Una vez que bottom es menor que 100, establece play en false

      }
      if (!play) {
        setBottom(bottom)

      }
    });
  };

  useEffect(() => {

    if (gameStarted) {

      caida();

    }
  }, [bottom, gameStarted]);

  const generateTube = () => {
    const minTubeHeight = 40; // Altura mínima del tubo
    const maxTubeHeight = (heightScreen / 2) - 40; // Altura máxima del tubo
    const gapBetweenTubes = 250; // Espacio entre tubos
    const tubeHeight = Math.floor(Math.random() * (maxTubeHeight - minTubeHeight + 1)) + minTubeHeight; // Altura aleatoria del tubo superior
    const newTube = {
      id: Date.now(), // Identificador único para el tubo
      topHeight: tubeHeight,
      bottomHeight: heightScreen - tubeHeight - gapBetweenTubes,
      xPosition: widthScreen + 0, // Colocar el tubo al final de la pantalla
    };
    setTubes(prevTubes => [...prevTubes, newTube]); // Agregar el nuevo tubo al estado de los tubos
  };
  const isTubeOutsideScreen = (tube) => {
    return tube.xPosition < -55; // Verificar si el tubo está completamente fuera de la pantalla por la izquierda
  };

  const removeOffscreenTubes = () => {
    setTubes(prevTubes => (
      prevTubes.filter(tube => !isTubeOutsideScreen(tube)) // Filtrar los tubos que no han salido de la pantalla
    ));
  };
  useEffect(() => {
    // Generar un nuevo tubo cada cierto intervalo de tiempo
    const tubeGenerator = setInterval(() => {
      if (play && gameStarted) {
        generateTube();
        removeOffscreenTubes(); // Eliminar los tubos que han salido de la pantalla
      }
    }, 1500); // Intervalo de 1.5 segundos (ajustable según la velocidad deseada)

    // Limpiar el intervalo cuando el componente se desmonte para evitar pérdida de memoria
    return () => clearInterval(tubeGenerator);
  }, [play, gameStarted]);
  useEffect(() => {
    // Mover los tubos hacia la izquierda cuando el juego está en curso (play es verdadero)

    const moveTubes = () => {
      requestAnimationFrame(() => {
        if (play) {
          setTubes(prevTubes => (
            prevTubes.map(tube => ({
              ...tube,
              xPosition: tube.xPosition - 5 // Velocidad de movimiento de los tubos hacia la izquierda
            }))
          ));
        }
      })
    };

    const tubesMovement = setInterval(moveTubes, 20); // Ajusta el intervalo según la velocidad deseada

    return () => clearInterval(tubesMovement);
  }, [play]);

  
  useEffect(() => {
    const checkCollision = () => {
      const birdRect = miDiv.current.getBoundingClientRect();

      const greenTopTubeRects = tubes.map(tube => ({
        top: 0,
        left: tube.xPosition,
        width: 80,
        height: tube.topHeight,

      }));
      const greenBottomTubeRects = tubes.map(tube => ({
        top: heightScreen - tube.bottomHeight,
        left: tube.xPosition,
        width: 80,
        height: tube.bottomHeight,

      }));


      // Comprobar colisión con las zonas verdes superiores de cada tubo
      greenTopTubeRects.forEach(tubeRect => {
        // Verificar si hay colisión entre los rectángulos del pájaro y del div verde superior
        if (
          birdRect.left < tubeRect.left + tubeRect.width &&
          birdRect.left + birdRect.width > tubeRect.left &&
          birdRect.top < tubeRect.top + tubeRect.height &&
          birdRect.top + birdRect.height > tubeRect.top
        ) {
          //console.log("222Colisión con la zona verde superior detectada");
          setPlay(false); // Detener el juego si hay colisión con la zona verde superior
       
        }
      });

      // Comprobar colisión con las zonas verdes inferiores de cada tubo
      greenBottomTubeRects.forEach(tubeRect => {
        // Verificar si hay colisión entre los rectángulos del pájaro y del div verde inferior
        if (
          birdRect.left < tubeRect.left + tubeRect.width &&
          birdRect.left + birdRect.width > tubeRect.left &&
          birdRect.top < tubeRect.top + tubeRect.height &&
          birdRect.top + birdRect.height > tubeRect.top
        ) {
          //console.log("3333Colisión con la zona verde inferior detectada");
          setPlay(false); // Detener el juego si hay colisión con la zona verde inferior
        }
      });
    };


    checkCollision();
  }, [bottom, tubes]);
  const [score, setScore] = useState(0)
  let puntos = 0
  useEffect(() => {
    const checkPassTube = () => {
      const birdX = miDiv.current.getBoundingClientRect().left;
      tubes.forEach(tube => {
        const tubeX = tube.xPosition;
        const tubeWidth = 80; // Ancho del tubo
        if (birdX > tubeX + tubeWidth) {
          // El pájaro ha pasado completamente este tubo
          if (!tube.passed) {
            // Incrementa el puntaje si este tubo aún no ha sido pasado
            puntos = puntos + 1
            setScore(prevScore => prevScore + 1);
            // Marca este tubo como pasado para evitar contar el mismo tubo varias veces
            setTubes(prevTubes =>
              prevTubes.map(prevTube =>
                prevTube.id === tube.id ? { ...prevTube, passed: true } : prevTube
              )
            );
          }
        }
      });
    };

    checkPassTube();
  }, [tubes]);
  useEffect(() => {
    localStorage.setItem("score", JSON.stringify(score))
    const highScore = localStorage.getItem("highScore")
    if (!highScore) {
      localStorage.setItem("highScore", JSON.stringify(score))
    } else {
      if (parseInt(highScore) < score) {
        localStorage.setItem("highScore", JSON.stringify(score))

      }
    }

  }, [score])

  const handleRestart = () => {

    restart()

  };

  return (
    <div tabIndex="0"
      className='scene'
    >

      <div ref={miDiv} className='bird' style={{
        bottom: `${bottom}px`,
        //transform: `rotate(${rotate}deg)`,
      }} > </div>




      {tubes.map(tube => (
        <div className='allPipes' key={tube.id} style={{ left: tube.xPosition, }}>
          <div className='pipeTop' style={{
            height: tube.topHeight,
          }}></div>
          <div className='pipeMiddle' style={{ top: -tube.topHeight, }}></div>
          <div className='pipeBottom' style={{ height: tube.bottomHeight, }}></div>
        </div>
      ))}

      <div className={play ? "background" : "backgroundStop"}

      ></div>
      {gameStarted && play ? <div className='scoreTextMain'>
        {score}
      </div> : null}
      {play ? null :
        <GameOver onRestart={handleRestart} />

      }



    </div >
  );
}

export default App;
