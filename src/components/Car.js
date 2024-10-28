// src/components/Car.js

import React from 'react';

const CAR_WIDTH = 61;
const CAR_HEIGHT = 65;

const Car = {
    draw: (context, car, image) => {
        if (image.complete && image.naturalWidth !== 0) {
            context.save();
            context.translate(car.x + CAR_WIDTH / 2, car.y + CAR_HEIGHT / 2);
            context.rotate(((car.angle + 90) * Math.PI) / 180);
            context.drawImage(image, -CAR_WIDTH / 2, -CAR_HEIGHT / 2, CAR_WIDTH, CAR_HEIGHT);
            context.restore();
        }
    },
};

export default Car;
