// src/components/App.js

import React, { useState, useRef, useEffect } from 'react';
import GameCanvas from './GameCanvas';
import Controls from './Controls';
import LapCounter from './LapCounter';
import '../App.css';

const App = () => {
    const [placingObject, setPlacingObject] = useState(null);
    const [selectedObstacleImage, setSelectedObstacleImage] = useState(null);
    const [lapsToWin, setLapsToWin] = useState(3);
    const [isPaused, setIsPaused] = useState(false);
    const [savedMaps, setSavedMaps] = useState([]);

    const gameCanvasRef = useRef(null);

    // Загрузка сохраненных карт из localStorage при монтировании компонента
    useEffect(() => {
        const maps = localStorage.getItem('savedMaps');
        if (maps) {
            setSavedMaps(JSON.parse(maps));
        }
    }, []);

    // Функция для сохранения карты
    const saveMap = () => {
        if (gameCanvasRef.current) {
            const mapName = prompt('Введите название карты:');
            if (mapName) {
                const mapData = gameCanvasRef.current.getMapData();
                mapData.name = mapName;

                const updatedMaps = [...savedMaps, mapData];
                setSavedMaps(updatedMaps);
                localStorage.setItem('savedMaps', JSON.stringify(updatedMaps));
                console.log('Карта сохранена:', mapName);
            }
        }
    };

    // Функция для удаления карт
    const removeMap = () => {
        if (gameCanvasRef.current) {
            const mapName = prompt('Введите название карты:');
            if (mapName) {
                const mapData = gameCanvasRef.current.getMapData();
                mapData.name = mapName;

                const updatedMaps = [...savedMaps, mapData];
                setSavedMaps(updatedMaps);
                localStorage.removeItem('savedMaps', JSON.stringify(updatedMaps));
                console.log('Карта удалена:', mapName);
            }
        }
    };

    // Функция для загрузки карты
    const loadMap = (mapName) => {
        const mapToLoad = savedMaps.find((map) => map.name === mapName);
        if (mapToLoad && gameCanvasRef.current) {
            gameCanvasRef.current.setMapData(mapToLoad);
            console.log('Карта загружена:', mapName);
        }
    };

    return (
        <div className="game-container">
            <Controls
                placingObject={placingObject}
                setPlacingObject={setPlacingObject}
                selectedObstacleImage={selectedObstacleImage}
                setSelectedObstacleImage={setSelectedObstacleImage}
                lapsToWin={lapsToWin}
                setLapsToWin={setLapsToWin}
                isPaused={isPaused}
                setIsPaused={setIsPaused}
                savedMaps={savedMaps}
                saveMap={saveMap}
                removeMap={removeMap}
                //removedMaps={removedMaps}
                loadMap={loadMap}
            />
            <GameCanvas
                ref={gameCanvasRef}
                placingObject={placingObject}
                selectedObstacleImage={selectedObstacleImage}
                lapsToWin={lapsToWin}
                isPaused={isPaused}
            />
        </div>
    );
};

export default App;
