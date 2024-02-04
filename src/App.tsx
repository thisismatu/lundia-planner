import { useState } from 'react';
import { Bookcase } from './Bookcase';
import PlusIcon from './assets/plus.svg?react';
import Logo from './assets/logo.svg?react';
import './App.css';

function App() {
  const [bookcases, setBookcases] = useState([crypto.randomUUID()]);

  return (
    <>
      <header className="header">
        <div className="header-logo">
          <Logo />
          <h1 className="desktop">Lundia Shelf Planner</h1>
          <h1 className="mobile">Planner</h1>
        </div>
        <button
          className="header-button"
          onClick={() => setBookcases((curr) => [...curr, crypto.randomUUID()])}
          disabled={bookcases.length > 7}
        >
          <PlusIcon />
          <span>Add bookcase</span>
        </button>
      </header>
      <div className="scroll-container" dir="ltr">
        <div className="container">
          {bookcases.map((uuid, i) => (
            <Bookcase
              key={`case-${uuid}`}
              onDelete={() => setBookcases(bookcases.filter((_, idx) => idx !== i))}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
