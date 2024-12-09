import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Nav from './ui/Nav';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const contextValue = { isLoggedIn, setIsLoggedIn }; 

  return (
    <>
      <h1 style={{ textAlign: 'center', backgroundColor: 'cornsilk' }}>JamWare Guitar Collection</h1>
      
      <div style={{ display: 'flex', padding: '0px', justifyContent: 'center', alignItems: 'center' }}>
      
        <Nav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
        <Outlet context={contextValue} />
      
      </div>
    </>
  );
}

export default App;
