// import React, { useState, useEffect } from 'react';
// import car1Image from './red_car-Photoroom.png'; // Путь к изображению первой машины
// import car2Image from './yellow_car-Photoroom.png';
// import App from "./App"; // Путь к изображению второй машины
//
// const CarGame = () => {
//     // Состояние для первой машины: координаты x, y и угол поворота
//     const [car1, setCar1] = useState({ x: 100, y: 100, angle: 0 });
//     // Состояние для второй машины
//     const [car2, setCar2] = useState({ x: 200, y: 100, angle: 0 });
//     // Объект для отслеживания нажатых клавиш
//     const [keysPressed, setKeysPressed] = useState({});
//
//     const speed = 5; // Скорость движения машин
//     const rotationSpeed = 5; // Скорость поворота машин
//
//     useEffect(() => {
//         const handleKeyDown = (e) => {
//             e.preventDefault(); // Предотвращаем стандартное поведение клавиш
//             setKeysPressed((keys) => ({ ...keys, [e.key]: true }));
//         };
//
//         const handleKeyUp = (e) => {
//             e.preventDefault();
//             setKeysPressed((keys) => ({ ...keys, [e.key]: false }));
//         };
//
//         window.addEventListener('keydown', handleKeyDown);
//         window.addEventListener('keyup', handleKeyUp);
//
//         // Таймер для обновления позиций машин
//         const interval = setInterval(() => {
//             updatePositions();
//         }, 30); // Обновляем каждые 30 миллисекунд
//
//         return () => {
//             window.removeEventListener('keydown', handleKeyDown);
//             window.removeEventListener('keyup', handleKeyUp);
//             clearInterval(interval);
//         };
//     }, []);
//
//     const updatePositions = () => {
//         // Обновление позиции первой машины
//         setCar1((prevCar1) => {
//             let { x, y, angle } = prevCar1;
//
//             if (keysPressed['w']) {
//                 // Движение вперед
//                 x += speed * Math.cos((angle * Math.PI) / 180);
//                 y += speed * Math.sin((angle * Math.PI) / 180);
//             }
//             if (keysPressed['s']) {
//                 // Движение назад
//                 x -= speed * Math.cos((angle * Math.PI) / 180);
//                 y -= speed * Math.sin((angle * Math.PI) / 180);
//             }
//             if (keysPressed['a']) {
//                 // Поворот влево
//                 angle -= rotationSpeed;
//             }
//             if (keysPressed['d']) {
//                 // Поворот вправо
//                 angle += rotationSpeed;
//             }
//
//             return { x, y, angle };
//         });
//
//         // Обновление позиции второй машины
//         setCar2((prevCar2) => {
//             let { x, y, angle } = prevCar2;
//
//             if (keysPressed['ArrowUp']) {
//                 x += speed * Math.cos((angle * Math.PI) / 180);
//                 y += speed * Math.sin((angle * Math.PI) / 180);
//             }
//             if (keysPressed['ArrowDown']) {
//                 x -= speed * Math.cos((angle * Math.PI) / 180);
//                 y -= speed * Math.sin((angle * Math.PI) / 180);
//             }
//             if (keysPressed['ArrowLeft']) {
//                 angle -= rotationSpeed;
//             }
//             if (keysPressed['ArrowRight']) {
//                 angle += rotationSpeed;
//             }
//
//             return { x, y, angle };
//         });
//     };
//
//     return (
//         <div>
//             <div
//                 style={{
//                     position: 'absolute',
//                     left: car1.x,
//                     top: car1.y,
//                     transform: `rotate(${car1.angle}deg)`,
//                 }}
//             >
//                 <img src={car1Image} alt="Машина 1" />
//             </div>
//             <div
//                 style={{
//                     position: 'absolute',
//                     left: car2.x,
//                     top: car2.y,
//                     transform: `rotate(${car2.angle}deg)`,
//                 }}
//             >
//                 <img src={car2Image} alt="Машина 2" />
//             </div>
//         </div>
//     );
// };
// export default CarGame;