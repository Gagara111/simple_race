import React from 'react';

const Car = ({ x, y, angle, image }) => {
    const angleRotate = `rotate(${angle}deg)`;
    return (
        <img
            src={image}
            alt="Car"
            style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                transform: `${angleRotate}`,
                width: '50px',
                height: '50px',
            }}
        />
    );
};

export default Car;

// dsefjfdkjs

// dsefjdkjsfdkjsu