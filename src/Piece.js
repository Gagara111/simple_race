import React from 'react';

const Piece = ({ color }) => {
    const pieceColor = color === 'white' ? '#fff' : '#000';

    return (
        <div
            style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: pieceColor,
                border: '2px solid #000',
            }}
        ></div>
    );
};

export default Piece;
