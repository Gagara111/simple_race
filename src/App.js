// import React from 'react';
// import CarGame from './CarGame';
//
// function App() {
//   return (
//       <div className="App">
//         <CarGame />
//       </div>
//   );
// }
//
// export default App;


import React, { useState, useEffect } from 'react';
import Car from './Car';
import Obstacle from './Obstacle';
import car1Img from './red_car-Photoroom.png';
import car2Img from './yellow_car-Photoroom.png';
import './App.css';

const App = () => {
    const [car1, setCar1] = useState({ x: 0, y: 0, angle: 0, speed: 0 });
    const [car2, setCar2] = useState({ x: 100, y: 100, angle: 0, speed: 0 });

    const obstacles = [
        { x: 150, y: 150, width: 50, height: 50 },
        { x: 300, y: 300, width: 50, height: 50 },
    ];

    const moveCar = (setCar, accelerate) => {
        setCar((prev) => {
            const speed = Math.max(0, Math.min(5, prev.speed + (accelerate ? 0.5 : -0.2)));
            const radians = (prev.angle * Math.PI) / 180;
            const dx = Math.cos(radians) * speed;
            const dy = Math.sin(radians) * speed;

            return {
                ...prev,
                x: Math.max(0, Math.min(450, prev.x + dx)),
                y: Math.max(0, Math.min(450, prev.y + dy)),
                speed,
            };
        });
    };

    const rotateCar = (setCar, angle) => {
        setCar((prev) => ({
            ...prev,
            angle: (prev.angle + angle) % 360,
        }));
    };

    const handleKeyDown = (event) => {
        switch (event.key) {
            case 'w':
                moveCar(setCar1, true);
                break;
            case 's':
                moveCar(setCar1, false);
                break;
            case 'a':
                rotateCar(setCar1, -10);
                break;
            case 'd':
                rotateCar(setCar1, 10);
                break;
            case 'ArrowUp':
                moveCar(setCar2, true);
                break;
            case 'ArrowDown':
                moveCar(setCar2, false);
                break;
            case 'ArrowLeft':
                rotateCar(setCar2, -10);
                break;
            case 'ArrowRight':
                rotateCar(setCar2, 10);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="game-container">
            <h1>Гонки</h1>
            <div className="track">
                <Car x={car1.x} y={car1.y} angle={car1.angle} image={car1Img} />
                <Car x={car2.x} y={car2.y} angle={car2.angle} image={car2Img} />
                {obstacles.map((obs, index) => (
                    <Obstacle key={index} {...obs} />
                ))}
            </div>
        </div>
    );
};

export default App;

//
// d

//
// dhfj