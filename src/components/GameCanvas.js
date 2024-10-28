// src/components/GameCanvas.js

import React, {
    useEffect,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
} from 'react';

import Car from './Car';
import Obstacle from './Obstacle';
import Line from './Line';
import LapCounter from './LapCounter';

import car1ImgSrc from '../assets/car1.png';
import car2ImgSrc from '../assets/car2.png';
import obstacle1ImgSrc from '../assets/obstacle1.png';
import obstacle2ImgSrc from '../assets/obstacle2.png';

const CAR_WIDTH = 50;
const CAR_HEIGHT = 50;
const OBSTACLE_WIDTH = 60;
const OBSTACLE_HEIGHT = 60;

const GameCanvas = forwardRef(
    ({ placingObject, selectedObstacleImage, lapsToWin, isPaused }, ref) => {
    const canvasRef = useRef(null);
    const requestRef = useRef(null);

    const car1OverFinishLine = useRef(false);
    const car2OverFinishLine = useRef(false);

    // Состояния и рефы
    const car1Ref = useRef({ x: 100, y: 100, angle: 0 });
    const car2Ref = useRef({ x: 400, y: 300, angle: 180 });

    const obstaclesRef = useRef([]).current;
    const linesRef = useRef([]).current;

    const [car1Collision, setCar1Collision] = useState(false);
    const [car2Collision, setCar2Collision] = useState(false);

    const [car1Laps, setCar1Laps] = useState(0);
    const [car2Laps, setCar2Laps] = useState(0);
    const [winner, setWinner] = useState(null);

    const activeKeys = useRef(new Set());

    // Загрузка изображений
    const car1Img = useRef(new Image());
    const car2Img = useRef(new Image());
    const obstacleImages = useRef({});

// Предоставляем методы getMapData и setMapData
        useImperativeHandle(ref, () => ({
            getMapData: () => {
                // Возвращаем текущие данные препятствий и линий
                const obstaclesData = obstaclesRef.map((obs) => ({
                    x: obs.x,
                    y: obs.y,
                    width: obs.width,
                    height: obs.height,
                    imageSrc: obs.image.src,
                }));

                const linesData = linesRef.map((line) => ({
                    x: line.x,
                    y: line.y,
                    width: line.width,
                    height: line.height,
                    type: line.type,
                }));

                return { obstacles: obstaclesData, lines: linesData };
            },
            setMapData: (mapData) => {
                // Очищаем текущие препятствия и линии
                obstaclesRef.length = 0;
                linesRef.length = 0;

                // Загружаем препятствия
                mapData.obstacles.forEach((obsData) => {
                    const image = new Image();
                    image.src = obsData.imageSrc;
                    obstaclesRef.push({
                        x: obsData.x,
                        y: obsData.y,
                        width: obsData.width,
                        height: obsData.height,
                        image,
                    });
                });

                // Загружаем линии
                mapData.lines.forEach((lineData) => {
                    linesRef.push({
                        x: lineData.x,
                        y: lineData.y,
                        width: lineData.width,
                        height: lineData.height,
                        type: lineData.type,
                    });
                });
                setCar1Laps(0);
                setCar2Laps(0);
                setWinner(null);
            },
        }));


    useEffect(() => {
        car1Img.current.src = car1ImgSrc;
        car2Img.current.src = car2ImgSrc;

        // Загрузка изображений препятствий
        const obstacle1 = new Image();
        obstacle1.src = obstacle1ImgSrc;
        obstacleImages.current[obstacle1ImgSrc] = obstacle1;

        const obstacle2 = new Image();
        obstacle2.src = obstacle2ImgSrc;
        obstacleImages.current[obstacle2ImgSrc] = obstacle2;
    }, []);

    // Обработка клавиш
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                // Переключение паузы
            } else {
                activeKeys.current.add(event.key.toLowerCase());
            }
        };

        const handleKeyUp = (event) => {
            activeKeys.current.delete(event.key.toLowerCase());
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Обработка клика по Canvas
    useEffect(() => {
        const canvas = canvasRef.current;

        const handleCanvasClick = (event) => {
            if (placingObject === 'obstacle' && selectedObstacleImage) {
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left - OBSTACLE_WIDTH / 2;
                const y = event.clientY - rect.top - OBSTACLE_HEIGHT / 2;

                const image = new Image();
                image.src = selectedObstacleImage.src;

                obstaclesRef.push({
                    x,
                    y,
                    width: OBSTACLE_WIDTH,
                    height: OBSTACLE_HEIGHT,
                    image,
                });
            } else if (placingObject === 'startLine' || placingObject === 'finishLine') {
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left - 50;
                const y = event.clientY - rect.top - 5;

                linesRef.push({
                    x,
                    y,
                    width: 100,
                    height: 10,
                    type: placingObject,
                });
            }
        };

        canvas.addEventListener('click', handleCanvasClick);

        return () => {
            canvas.removeEventListener('click', handleCanvasClick);
        };
    }, [placingObject, selectedObstacleImage]);

    // Игровой цикл
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();

        window.addEventListener('resize', setCanvasSize);

        const moveCar = (car, controls) => {
            let {x, y, angle} = car;
            let speed = 2;
            const rotationSpeed = 5;
            const moveSpeed = 5;

            if (activeKeys.current.has(controls.forward)) {
                speed = moveSpeed;
            } else if (activeKeys.current.has(controls.backward)) {
                speed = -moveSpeed;
            }

            if (activeKeys.current.has(controls.left)) {
                angle -= rotationSpeed;
            }
            if (activeKeys.current.has(controls.right)) {
                angle += rotationSpeed;
            }

            const radians = (angle * Math.PI) / 180;
            const dx = Math.cos(radians) * speed;
            const dy = Math.sin(radians) * speed;

            let newX = x + dx;
            let newY = y + dy;

            newX = Math.max(0, Math.min(newX, canvas.width - CAR_WIDTH));
            newY = Math.max(0, Math.min(newY, canvas.height - CAR_HEIGHT));

            return {x: newX, y: newY, angle};
        };

        const isColliding = (a, b) => {
            return !(
                a.x + a.width < b.x ||
                a.x > b.x + b.width ||
                a.y + a.height < b.y ||
                a.y > b.y + b.height
            );
        };

        const update = () => {
            if (isPaused || winner) {
                requestRef.current = requestAnimationFrame(update);
                return;
            }

            // Перемещение машин
            const newCar1 = car1Collision
                ? car1Ref.current
                : moveCar(car1Ref.current, {
                    forward: 'w',
                    backward: 's',
                    left: 'a',
                    right: 'd',
                });

            const newCar2 = car2Collision
                ? car2Ref.current
                : moveCar(car2Ref.current, {
                    forward: 'arrowup',
                    backward: 'arrowdown',
                    left: 'arrowleft',
                    right: 'arrowright',
                });

            const car1Rect = {x: newCar1.x, y: newCar1.y, width: CAR_WIDTH, height: CAR_HEIGHT};
            const car2Rect = {x: newCar2.x, y: newCar2.y, width: CAR_WIDTH, height: CAR_HEIGHT};

            // Обработка столкновений
            if (isColliding(car1Rect, car2Rect)) {
                setCar1Collision(true);
                setCar2Collision(true);
            } else {
                let car1CollisionWithObstacle = false;
                let car2CollisionWithObstacle = false;

                for (let obs of obstaclesRef) {
                    const obstacleRect = {x: obs.x, y: obs.y, width: obs.width, height: obs.height};
                    if (isColliding(car1Rect, obstacleRect)) {
                        car1CollisionWithObstacle = true;
                    }
                    if (isColliding(car2Rect, obstacleRect)) {
                        car2CollisionWithObstacle = true;
                    }
                }

                setCar1Collision(car1CollisionWithObstacle);
                setCar2Collision(car2CollisionWithObstacle);

                if (!car1CollisionWithObstacle) {
                    car1Ref.current = newCar1;
                }
                if (!car2CollisionWithObstacle) {
                    car2Ref.current = newCar2;
                }
            }

            // Проверка пересечения финишной линии
            const finishLine = linesRef.find((line) => line.type === 'finishLine');

            if (finishLine) {
                const finishLineRect = {
                    x: finishLine.x,
                    y: finishLine.y,
                    width: finishLine.width,
                    height: finishLine.height,
                };

                // Для машины 1
                const isCar1OverFinishLine = isColliding(car1Rect, finishLineRect);

                if (isCar1OverFinishLine && !car1OverFinishLine.current) {
                    setCar1Laps((prev) => {
                        const newLaps = prev + 1;
                        if (newLaps >= lapsToWin) {
                            setWinner('Машина 1');
                        }
                        return newLaps;
                    });
                }
                car1OverFinishLine.current = isCar1OverFinishLine;

                // Для машины 2
                const isCar2OverFinishLine = isColliding(car2Rect, finishLineRect);

                if (isCar2OverFinishLine && !car2OverFinishLine.current) {
                    setCar2Laps((prev) => {
                        const newLaps = prev + 1;
                        if (newLaps >= lapsToWin) {
                            setWinner('Машина 2');
                        }
                        return newLaps;
                    });
                }
                car2OverFinishLine.current = isCar2OverFinishLine;
            }

            // Очистка Canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Отрисовка трека
            context.fillStyle = '#7CFC00';
            context.fillRect(0, 0, canvas.width, canvas.height);

            // Отрисовка препятствий
            obstaclesRef.forEach((obs) => {
                Obstacle.draw(context, obs);
            });

            // Отрисовка линий
            linesRef.forEach((line) => {
                Line.draw(context, line);
            });

            // Отрисовка машин
            Car.draw(context, car1Ref.current, car1Img.current);
            Car.draw(context, car2Ref.current, car2Img.current);

            // Отображение победителя
            if (winner) {
                context.fillStyle = 'blue';
                context.font = '40px Arial';
                context.textAlign = 'center';
                context.fillText(`${winner} победила!`, canvas.width / 2, 100);
            }

            requestRef.current = requestAnimationFrame(update);
        };

        requestRef.current = requestAnimationFrame(update);
        // Добавляем функцию очистки при размонтировании
        return () => {
            cancelAnimationFrame(requestRef.current);
            window.removeEventListener('resize', setCanvasSize);
        };
    }, [isPaused, winner, lapsToWin]); // Не забудьте закрыть useEffect здесь

        // Возврат JSX-компонента
        return (
            <>
                <canvas ref={canvasRef} />
                <LapCounter
                    car1Laps={car1Laps}
                    car2Laps={car2Laps}
                    lapsToWin={lapsToWin}
                />
                {winner && <div className="winner-alert">{winner} победила!</div>}
            </>
        );
    } // закрываем функцию компонента
); // закрываем forwardRef

export default GameCanvas;