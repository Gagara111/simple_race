// src/components/Line.js

import React from 'react';

const Line = {
    draw: (context, line) => {
        context.fillStyle = line.type === 'startLine' ? 'white' : 'black';
        context.fillRect(line.x, line.y, line.width, line.height);
    },
};

export default Line;
