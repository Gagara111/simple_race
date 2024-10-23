import React from 'react';

const Obstacle = ({ x, y, width, height }) => {
    return (
        <div
            style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: 'black',
            }}
        />
    );
};

export default Obstacle;
// dsfd
// dsfdksmhjh