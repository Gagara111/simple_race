// src/App.js

import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import car1ImgSrc from './assets/car1.png'; // Импорт изображения первой машины
import car2ImgSrc from './assets/car2.png'; // Импорт изображения второй машины
import obstacle1ImgSrc from './assets/obstacle1.png'; // Импорт изображения первого препятствия
import obstacle2ImgSrc from './assets/obstacle2.png'; // Импорт изображения второго препятствия

// Константы для размеров машин
const CAR_WIDTH = 50;
const CAR_HEIGHT = 50;

// Константы для размеров препятствий
const OBSTACLE_WIDTH = 60;
const OBSTACLE_HEIGHT = 60;

const App = () => {
  // Ссылка на элемент <canvas>, используемый для рисования графики игры
  const canvasRef = useRef(null);

  // Ссылка для хранения идентификатора анимационного кадра, чтобы можно было отменить его при размонтировании компонента
  const requestRef = useRef(null);

  // Состояние первой машины
  const car1Ref = useRef({ x: 100, y: 100, angle: 0 });

  // Состояние второй машины
  const car2Ref = useRef({ x: 400, y: 300, angle: 180 });

  // Список препятствий на треке
  const obstaclesRef = useRef([
    { x: 200, y: 200, width: OBSTACLE_WIDTH, height: OBSTACLE_HEIGHT, image: null },
    { x: 500, y: 350, width: OBSTACLE_WIDTH, height: OBSTACLE_HEIGHT, image: null },
    // Добавьте больше препятствий по необходимости
  ]).current;

  // Набор активных клавиш
  const activeKeys = useRef(new Set());

  // Состояние для отображения уведомления о столкновении
  const [collision, setCollision] = useState(false);

  // Ссылки для хранения загруженных изображений машин
  const car1Img = useRef(new Image());
  const car2Img = useRef(new Image());

  // Ссылки для хранения загруженных изображений препятствий
  const obstacle1Img = useRef(new Image());
  const obstacle2Img = useRef(new Image());

  // Состояние для режима размещения препятствия и выбранного изображения
  const [placingObstacle, setPlacingObstacle] = useState(false);
  const [selectedObstacleImage, setSelectedObstacleImage] = useState(null);

  // Загрузка изображений машин и препятствий при монтировании компонента
  useEffect(() => {
    // Загрузка изображений машин
    car1Img.current.src = car1ImgSrc;
    car2Img.current.src = car2ImgSrc;

    // Обработка загрузки изображений машин
    car1Img.current.onload = () => {
      console.log('Car1 image loaded');
    };
    car1Img.current.onerror = () => {
      console.error('Failed to load Car1 image');
    };

    car2Img.current.onload = () => {
      console.log('Car2 image loaded');
    };
    car2Img.current.onerror = () => {
      console.error('Failed to load Car2 image');
    };

    // Загрузка изображений препятствий
    obstacle1Img.current.src = obstacle1ImgSrc;
    obstacle2Img.current.src = obstacle2ImgSrc;

    // Обработка загрузки изображений препятствий
    obstacle1Img.current.onload = () => {
      console.log('Obstacle1 image loaded');
      obstaclesRef[0].image = obstacle1Img.current;
    };
    obstacle1Img.current.onerror = () => {
      console.error('Failed to load Obstacle1 image');
    };

    obstacle2Img.current.onload = () => {
      console.log('Obstacle2 image loaded');
      obstaclesRef[1].image = obstacle2Img.current;
    };
    obstacle2Img.current.onerror = () => {
      console.error('Failed to load Obstacle2 image');
    };
  }, [obstacle1Img, obstacle2Img, obstaclesRef]);

  // Обработка нажатия и отпускания клавиш
  useEffect(() => {
    const handleKeyDown = (event) => {
      const keysToPrevent = [
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'w',
        'a',
        's',
        'd',
        'W',
        'A',
        'S',
        'D',
      ];
      if (keysToPrevent.includes(event.key)) {
        event.preventDefault();
      }
      activeKeys.current.add(event.key.toLowerCase());
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

  // Основной игровой цикл
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    window.addEventListener('resize', setCanvasSize);

    // Обработчик клика по Canvas для размещения препятствий
    const handleCanvasClick = (event) => {
      if (placingObstacle && selectedObstacleImage) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left - OBSTACLE_WIDTH / 2;
        const y = event.clientY - rect.top - OBSTACLE_HEIGHT / 2;

        // Проверка, загружено ли изображение
        if (selectedObstacleImage.complete && selectedObstacleImage.naturalWidth !== 0) {
          obstaclesRef.push({
            x,
            y,
            width: OBSTACLE_WIDTH,
            height: OBSTACLE_HEIGHT,
            image: selectedObstacleImage,
          });

          // Выйти из режима размещения препятствия
          setPlacingObstacle(false);
          setSelectedObstacleImage(null);
          console.log('New obstacle placed');
        } else {
          console.warn('Selected obstacle image is not loaded');
        }
      }
    };

    canvas.addEventListener('click', handleCanvasClick);

    // Функция для перемещения машины на основе активных клавиш
    const moveCar = (car, controls) => {
      let { x, y, angle } = car;
      let speed = 0;
      const rotationSpeed = 5;
      const moveSpeed = 3;

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

      return { x: newX, y: newY, angle };
    };

    // Функция проверки столкновения между двумя прямоугольниками (AABB)
    const isColliding = (a, b) => {
      return !(
          a.x + a.width < b.x ||
          a.x > b.x + b.width ||
          a.y + a.height < b.y ||
          a.y > b.y + b.height
      );
    };

    // Основной цикл обновления состояния игры
    const update = () => {
      const newCar1 = moveCar(car1Ref.current, {
        forward: 'w',
        backward: 's',
        left: 'a',
        right: 'd',
      });

      const newCar2 = moveCar(car2Ref.current, {
        forward: 'arrowup',
        backward: 'arrowdown',
        left: 'arrowleft',
        right: 'arrowright',
      });

      const car1Rect = { x: newCar1.x, y: newCar1.y, width: CAR_WIDTH, height: CAR_HEIGHT };
      const car2Rect = { x: newCar2.x, y: newCar2.y, width: CAR_WIDTH, height: CAR_HEIGHT };

      // Проверка столкновения между машинами
      if (isColliding(car1Rect, car2Rect)) {
        setCollision(true);
      } else {
        // Проверка столкновений с препятствиями
        let collisionWithObstacle = false;
        for (let obs of obstaclesRef) {
          const obstacleRect = { x: obs.x, y: obs.y, width: obs.width, height: obs.height };
          if (isColliding(car1Rect, obstacleRect) || isColliding(car2Rect, obstacleRect)) {
            collisionWithObstacle = true;
            break;
          }
        }

        if (collisionWithObstacle) {
          setCollision(true);
        } else {
          setCollision(false);
          car1Ref.current = newCar1;
          car2Ref.current = newCar2;
        }
      }

      // Очистка Canvas перед рисованием нового кадра
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Отрисовка трека (фон)
      context.fillStyle = '#7CFC00'; // Светло-зеленый цвет трека
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Отрисовка препятствий
      for (let obs of obstaclesRef) {
        if (obs.image && obs.image.complete && obs.image.naturalWidth !== 0) {
          context.drawImage(obs.image, obs.x, obs.y, obs.width, obs.height);
          // Отрисовка границы препятствия
          context.strokeStyle = 'red';
          context.lineWidth = 2;
          context.strokeRect(obs.x, obs.y, obs.width, obs.height);
        } else {
          // Если изображение не загружено, рисуем простой черный прямоугольник
          context.fillStyle = 'black';
          context.fillRect(obs.x, obs.y, obs.width, obs.height);
        }
      }

      // Отрисовка первой машины
      const car1 = car1Ref.current;
      if (car1Img.current.complete && car1Img.current.naturalWidth !== 0) {
        context.save();
        context.translate(car1.x + CAR_WIDTH / 2, car1.y + CAR_HEIGHT / 2);
        context.rotate(((car1.angle + 90) * Math.PI) / 180);
        context.drawImage(car1Img.current, -CAR_WIDTH / 2, -CAR_HEIGHT / 2, CAR_WIDTH, CAR_HEIGHT);
        context.restore();
      }

      // Отрисовка второй машины
      const car2 = car2Ref.current;
      if (car2Img.current.complete && car2Img.current.naturalWidth !== 0) {
        context.save();
        context.translate(car2.x + CAR_WIDTH / 2, car2.y + CAR_HEIGHT / 2);
        context.rotate(((car2.angle + 90) * Math.PI) / 180);
        context.drawImage(car2Img.current, -CAR_WIDTH / 2, -CAR_HEIGHT / 2, CAR_WIDTH, CAR_HEIGHT);
        context.restore();
      }

      // Отрисовка уведомления о столкновении
      if (collision) {
        context.fillStyle = 'red';
        context.font = '30px Arial';
        context.textAlign = 'center';
        context.fillText('Столкновение!', canvas.width / 2, 50);
      }

      // Запрос следующего кадра анимации
      requestRef.current = requestAnimationFrame(update);
    };

    // Запуск игрового цикла
    requestRef.current = requestAnimationFrame(update);

    // Добавляем слушатель кликов по Canvas
    canvas.addEventListener('click', handleCanvasClick);

    // Очистка слушателей при размонтировании компонента
    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', setCanvasSize);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [placingObstacle, selectedObstacleImage, obstacle1Img, obstacle2Img, obstaclesRef]);

  return (
      <div className="game-container">
        {/* Панель управления для размещения препятствий */}
        <div className="controls">
          <button onClick={() => setPlacingObstacle(!placingObstacle)}>
            {placingObstacle ? 'Отмена Размещения' : 'Разместить Препятствие'}
          </button>

          {placingObstacle && (
              <div className="obstacle-images">
                <img
                    src={obstacle1ImgSrc}
                    alt="Obstacle 1"
                    style={{
                      width: '50px',
                      height: '50px',
                      border: selectedObstacleImage === obstacle1Img.current ? '2px solid blue' : '1px solid gray',
                      cursor: 'pointer',
                      margin: '5px',
                    }}
                    onClick={() => setSelectedObstacleImage(obstacle1Img.current)}
                />
                <img
                    src={obstacle2ImgSrc}
                    alt="Obstacle 2"
                    style={{
                      width: '50px',
                      height: '50px',
                      border: selectedObstacleImage === obstacle2Img.current ? '2px solid blue' : '1px solid gray',
                      cursor: 'pointer',
                      margin: '5px',
                    }}
                    onClick={() => setSelectedObstacleImage(obstacle2Img.current)}
                />
                {/* Добавьте больше изображений препятствий по необходимости */}
              </div>
          )}
        </div>

        {/* Элемент Canvas, на котором будет отрисовываться игра */}
        <canvas ref={canvasRef} />

        {/* Уведомление о столкновении, отображается поверх Canvas */}
        {collision && <div className="collision-alert">Столкновение!</div>}
      </div>
  );
};

export default App;
