// src/components/LapCounter.js

import React from 'react';

const LapCounter = ({ car1Laps, car2Laps, lapsToWin }) => {
    return (
        <div className="laps-info">
            <div>Машина 1 круги: {car1Laps}</div>
            <div>Машина 2 круги: {car2Laps}</div>
            <div>Кругов для победы: {lapsToWin}</div>
        </div>
    );
};

export default LapCounter;
