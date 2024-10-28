// src/components/Controls.js

import React, { useState } from 'react';
import obstacle1ImgSrc from '../assets/obstacle1.png';
import obstacle2ImgSrc from '../assets/obstacle2.png';

const Controls = ({
                      placingObject,
                      setPlacingObject,
                      selectedObstacleImage,
                      setSelectedObstacleImage,
                      lapsToWin,
                      setLapsToWin,
                      isPaused,
                      setIsPaused,
                      savedMaps,
                      saveMap,
                      loadMap,
                  }) => {
    const [showLoadMap, setShowLoadMap] = useState(false);

    return (
        <div className="controls">
            <button
                onClick={() =>
                    setPlacingObject(placingObject === 'obstacle' ? null : 'obstacle')
                }
            >
                {placingObject === 'obstacle'
                    ? 'Отмена Размещения Препятствия'
                    : 'Разместить Препятствие'}
            </button>
            <button
                onClick={() =>
                    setPlacingObject(placingObject === 'startLine' ? null : 'startLine')
                }
            >
                {placingObject === 'startLine'
                    ? 'Отмена Размещения Стартовой Линии'
                    : 'Разместить Стартовую Линию'}
            </button>
            <button
                onClick={() =>
                    setPlacingObject(placingObject === 'finishLine' ? null : 'finishLine')
                }
            >
                {placingObject === 'finishLine'
                    ? 'Отмена Размещения Финишной Линии'
                    : 'Разместить Финишную Линию'}
            </button>

            {/* Кнопки сохранения и загрузки карт */}
            <button onClick={saveMap}>Сохранить Карту</button>
            <button onClick={() => setShowLoadMap(true)}>Загрузить Карту</button>

            {/* Интерфейс для выбора карты при загрузке */}
            {showLoadMap && (
                <div className="load-map-dialog">
                    <h3>Выберите карту для загрузки:</h3>
                    <ul>
                        {savedMaps.map((map, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => {
                                        loadMap(map.name);
                                        setShowLoadMap(false);
                                    }}
                                >
                                    {map.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setShowLoadMap(false)}>Отмена</button>
                </div>
            )}

            {/* Размещение препятствий */}
            {placingObject === 'obstacle' && (
                <div className="obstacle-images">
                    <img
                        src={obstacle1ImgSrc}
                        alt="Obstacle 1"
                        style={{
                            width: '50px',
                            height: '50px',
                            border:
                                selectedObstacleImage &&
                                selectedObstacleImage.src === obstacle1ImgSrc
                                    ? '2px solid blue'
                                    : '1px solid gray',
                            cursor: 'pointer',
                            margin: '5px',
                        }}
                        onClick={() => setSelectedObstacleImage({ src: obstacle1ImgSrc })}
                    />
                    <img
                        src={obstacle2ImgSrc}
                        alt="Obstacle 2"
                        style={{
                            width: '50px',
                            height: '50px',
                            border:
                                selectedObstacleImage &&
                                selectedObstacleImage.src === obstacle2ImgSrc
                                    ? '2px solid blue'
                                    : '1px solid gray',
                            cursor: 'pointer',
                            margin: '5px',
                        }}
                        onClick={() => setSelectedObstacleImage({ src: obstacle2ImgSrc })}
                    />
                </div>
            )}

            {/* Настройка количества кругов */}
            <div className="laps-settings">
                <label>
                    Кругов для победы:
                    <input
                        type="number"
                        value={lapsToWin}
                        onChange={(e) => setLapsToWin(Number(e.target.value))}
                        min={1}
                    />
                </label>
            </div>

            {/* Кнопка паузы */}
            <button onClick={() => setIsPaused(!isPaused)}>
                {isPaused ? 'Продолжить' : 'Пауза'}
            </button>
        </div>
    );
};

export default Controls;
