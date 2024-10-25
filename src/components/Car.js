// src/components/Car.js

import React from 'react';

/**
 * Компонент Car отвечает за отображение машины на экране.
 *
 * @param {number} x - Координата X машины на Canvas.
 * @param {number} y - Координата Y машины на Canvas.
 * @param {number} angle - Угол поворота машины в градусах.
 * @param {string} image - URL изображения машины.
 */
const Car = ({ x, y, angle, image }) => {
    return (
        <img
            src={image} // Источник изображения машины
            alt="Car" // Альтернативный текст для изображения
            style={{
                position: 'absolute', // Абсолютное позиционирование относительно ближайшего родителя с position: relative
                left: `${x}px`, // Позиция по оси X
                top: `${y}px`, // Позиция по оси Y
                transform: `rotate(${angle + 90}deg)`, // Поворот изображения на угол поворота + 90 градусов для корректного отображения
                width: '50px', // Ширина изображения машины
                height: '50px', // Высота изображения машины
                transition: 'transform 0.1s linear', // Плавный поворот при изменении угла
                pointerEvents: 'none', // Игнорирует события указателя (например, клики), чтобы не мешать взаимодействию с другими элементами
            }}
        />
    );
};

export default Car;
