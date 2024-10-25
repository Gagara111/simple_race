// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Импорт глобальных стилей
import App from './App'; // Импорт основного компонента приложения

// Рендеринг компонента App внутри элемента с id 'root' в HTML
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
