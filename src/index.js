// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Глобальные стили
import App from './components/App'; // Импорт основного компонента

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
