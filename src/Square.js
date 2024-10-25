import React from 'react';
import Piece from './Piece';

const Square = ({ row, col, value, onClick, isSelected }) => {
    const isDark = (row + col) % 2 === 1;
    const backgroundColor = isDark ? '#769656' : '#eeeed2';
    const border = isSelected ? '2px solid red' : 'none';

    return (
        <div
            onClick={() => onClick(row, col)}
            style={{
                width: '50px',
                height: '50px',
                boxSizing: 'border-box', // Убедитесь, что это свойство добавлено
                backgroundColor: backgroundColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: border,
            }}
        >
            {value && <Piece color={value} />}
        </div>
    );
};

export default Square;
