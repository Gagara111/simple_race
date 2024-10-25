// src/components/Obstacle.js

import React from 'react';

/**
 * Компонент Obstacle отвечает за отображение препятствия на экране.
 *
 * @param {number} x - Координата X препятствия на Canvas.
 * @param {number} y - Координата Y препятствия на Canvas.
 * @param {number} width - Ширина препятствия.
 * @param {number} height - Высота препятствия.
 */
const Obstacle = ({ x, y, width, height }) => {
    return (
        <div
            style={{
                position: 'absolute', // Абсолютное позиционирование относительно ближайшего родителя с position: relative
                left: `${x}px`, // Позиция по оси X
                top: `${y}px`, // Позиция по оси Y
                width: `${width}px`, // Ширина препятствия
                height: `${height}px`, // Высота препятствия
                backgroundColor: 'black', // Цвет фона препятствия
                border: '2px solid #555', // Серый бордер для улучшения видимости
                borderRadius: '5px', // Скругление углов препятствия
            }}
        />
    );
};

export default Obstacle;
