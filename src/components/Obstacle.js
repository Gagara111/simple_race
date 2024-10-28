// src/components/Obstacle.js

import React from 'react';

const Obstacle = {
    draw: (context, obstacle) => {
        if (obstacle.image && obstacle.image.complete && obstacle.image.naturalWidth !== 0) {
            context.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            context.strokeStyle = 'red';
            context.lineWidth = 2;
            context.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else {
            context.fillStyle = 'black';
            context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
    },
};

export default Obstacle;
