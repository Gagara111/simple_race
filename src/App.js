import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
    // Параметры игры
    const trackRadius = 200; // Радиус круговой трассы
    const carSize = 20; // Размер машин
    const maxSpeed = 5; // Максимальная скорость
    const friction = 0.9; // Коэффициент трения
    const collisionSlowdown = 0.5; // Коэффициент замедления при столкновении с краем
    const lapCount = 3; // Количество кругов

    // Состояния игры
    const [cars, setCars] = useState([
        {
            x: trackRadius,
            y: 0,
            angle: 0,
            speed: 0,
            color: 'red',
            laps: 0,
        },
        {
            x: trackRadius,
            y: 0,
            angle: 0,
            speed: 0,
            color: 'blue',
            laps: 0,
        },
    ]);
    const [winner, setWinner] = useState(null); // Имя победителя
    const [gameOver, setGameOver] = useState(false); // Флаг окончания игры
    const [isPaused, setIsPaused] = useState(false); // Флаг паузы
    const [user, setUser] = useState(null); // Текущий пользователь

    // Референсы для Canvas
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    // Обработка событий клавиатуры
    const handleKeyDown = (event) => {
        if (isPaused) return;

        const carIndex = event.key === 'ArrowUp' || event.key === 'w' ? 0 : 1;
        switch (event.key) {
            case 'ArrowUp': // Верхняя стрелка - вперед
            case 'w':
                cars[carIndex].speed += 0.1;
                if (cars[carIndex].speed > maxSpeed) cars[carIndex].speed = maxSpeed;
                break;
            case 'ArrowDown': // Нижняя стрелка - назад
            case 's':
                cars[carIndex].speed -= 0.1;
                if (cars[carIndex].speed < -maxSpeed) cars[carIndex].speed = -maxSpeed;
                break;
            case 'ArrowLeft': // Левая стрелка - влево
            case 'a':
                cars[carIndex].angle -= 0.1;
                break;
            case 'ArrowRight': // Правая стрелка - вправо
            case 'd':
                cars[carIndex].angle += 0.1;
                break;
        }
    };

    // Обновление позиций машин
    const updateCars = () => {
        const newCars = [...cars];

        newCars.forEach((car, index) => {
            // Движение по траектории
            car.x += Math.cos(car.angle) * car.speed;
            car.y += Math.sin(car.angle) * car.speed;

            // Замедление при столкновении с краями
            if (
                Math.sqrt(car.x * car.x + car.y * car.y) > trackRadius - carSize / 2
            ) {
                car.speed *= collisionSlowdown;
            }

            // Определение пересечения финишной линии
            if (car.x > trackRadius && car.y > 0 && car.y < carSize) {
                car.laps += 1;
                if (car.laps >= lapCount) {
                    setGameOver(true);
                    setWinner(`Победитель: ${car.color} машина`);
                }
            }

            // Применение трения
            car.speed *= friction;
        });

        setCars(newCars);
    };

    // Проверка столкновений
    const checkCollisions = () => {
        const newCars = [...cars];

        newCars.forEach((car1, index1) => {
            newCars.forEach((car2, index2) => {
                if (index1 !== index2) {
                    const distance = Math.sqrt(
                        Math.pow(car1.x - car2.x, 2) + Math.pow(car1.y - car2.y, 2)
                    );
                    if (distance < carSize) {
                        // Изменение скорости и направления при столкновении
                        car1.speed *= collisionSlowdown;
                        car2.speed *= collisionSlowdown;
                        car1.angle += Math.random() * 0.5 - 0.25;
                        car2.angle += Math.random() * 0.5 - 0.25;
                    }
                }
            });
        });

        setCars(newCars);
    };

    // Рендеринг игры на Canvas
    const drawGame = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Рисование трассы
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, trackRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.stroke();

        // Рисование машин
        cars.forEach((car) => {
            ctx.fillStyle = car.color;
            ctx.beginPath();
            ctx.rect(
                car.x - carSize / 2,
                car.y - carSize / 2,
                carSize,
                carSize
            );
            ctx.fill();
        });

        // Рисование финишной линии
        ctx.beginPath();
        ctx.moveTo(trackRadius, 0);
        ctx.lineTo(trackRadius + 10, 0);
        ctx.lineTo(trackRadius + 10, carSize);
        ctx.lineTo(trackRadius, carSize);
        ctx.strokeStyle = 'black';
        ctx.stroke();

        // Отображение сообщения о победителе
        if (gameOver) {
            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.fillText(winner, canvas.width / 2 - 100, canvas.height / 2);
        }
    };

    // Обновление игры
    useEffect(() => {
        if (!gameOver && !isPaused) {
            updateCars();
            checkCollisions();
            drawGame();
        }

        const animation = requestAnimationFrame(updateCars);
        return () => cancelAnimationFrame(animation);
    }, [cars, gameOver, isPaused]);

    // Инициализация Canvas при рендеринге
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctxRef.current = ctx;
    }, []);

    // Обработчик паузы
    const handlePause = () => {
        setIsPaused(!isPaused);
    };

    return (
        <div className="App">
            <h1>Гонки</h1>
            <canvas ref={canvasRef} width={500} height={500} />
            <button onClick={handlePause}>
                {isPaused ? 'Продолжить' : 'Пауза'}
            </button>

            {/*  Блок для регистрации пользователя */}
            {!user && (
                <div>
                    <h2>Регистрация</h2>
                    <input type="text" placeholder="Логин" />
                    <input type="password" placeholder="Пароль" />
                    <button>Зарегистрироваться</button>
                </div>
            )}

            {/*  Блок для отображения информации о пользователе */}
            {user && (
                <div>
                    <h2>Привет, {user.login}!</h2>
                    <button>Выйти</button>
                </div>
            )}
        </div>
    );
};

export default App;



// import logo from './logo.svg';
// import './App.css';
// import React, {useState} from "react";
//
// const App = () => {
//   const [position, setPosition] = useState(0);
//
//   const moveCar = () => {
//     setPosition(position + 10);
//   };
//
//   return (
//       <div>
//           <h1>ГОНКИ</h1>
//           <div style={{position: 'relative', width: '500px', height: '100px', backgroundColor: 'grey'}}>
//               <div style={{
//                   position: 'absolute',
//                   left: `${position}px`,
//                   width: '50px',
//                   height: '50px',
//                   backgroundColor: 'blue'
//               }}></div>
//           </div>
//           <div style={{position: 'relative', width: '500px', height: '100px', backgroundColor: 'grey'}}>
//               <div style={{
//                   position: 'absolute',
//                   left: `${position}px`,
//                   width: '50px',
//                   height: '50px',
//                   backgroundColor: 'green'
//               }}></div>
//           </div>
//           <button onClick={moveCar}>Двигаться</button>
//       </div>
//   );
// };
//
// export default App;
