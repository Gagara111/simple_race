import logo from './logo.svg';
import './App.css';
import React, {useState} from "react";

const App = () => {
  const [position, setPosition] = useState(0);

  const moveCar = () => {
    setPosition(position + 10);
  };

  return (
      <div>
          <h1>ГОНКИ</h1>
          <div style={{position: 'relative', width: '500px', height: '100px', backgroundColor: 'grey'}}>
              <div style={{
                  position: 'absolute',
                  left: `${position}px`,
                  width: '50px',
                  height: '50px',
                  backgroundColor: 'blue'
              }}></div>
          </div>
          <div style={{position: 'relative', width: '500px', height: '100px', backgroundColor: 'grey'}}>
              <div style={{
                  position: 'absolute',
                  left: `${position}px`,
                  width: '50px',
                  height: '50px',
                  backgroundColor: 'green'
              }}></div>
          </div>
          <button onClick={moveCar}>Двигаться</button>
      </div>
  );
};

export default App;
