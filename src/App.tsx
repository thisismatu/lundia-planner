import { useState } from 'react';
import { Bookcase } from './Bookcase';
import MinusIcon from './assets/minus.svg?react';
import PlusIcon from './assets/plus.svg?react';
import './App.css';

function App() {
  const [bookcases, setBookcases] = useState([crypto.randomUUID()]);

  return (
    <>
      <div className="wrapper">
        <button
          className="button"
          onClick={() => setBookcases((curr) => curr.slice(0, -1))}
          disabled={bookcases.length < 2}
        >
          <MinusIcon />
        </button>
        {bookcases.map((uuid, i) => (
          <Bookcase
            key={`case-${uuid}`}
            onDelete={() => setBookcases(bookcases.filter((_, idx) => idx !== i))}
          />
        ))}
        <button
          className="button"
          onClick={() => setBookcases((curr) => [...curr, crypto.randomUUID()])}
          disabled={bookcases.length > 6}
        >
          <PlusIcon />
        </button>
      </div>
    </>
  );
}

export default App;
