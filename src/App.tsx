import { useEffect, useRef, useState } from 'react';
import { Plus as PlusIcon } from 'lucide-react';
import { Bookcase } from './Bookcase';
import Logo from './assets/logo.svg?react';
import './App.css';

function App() {
  const [bookcases, setBookcases] = useState([crypto.randomUUID()]);
  const bookcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bookcaseRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [bookcases]);

  return (
    <>
      <header className="header">
        <div className="header-logo">
          <Logo />
          <h1>Lundia Planner</h1>
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
              ref={bookcaseRef}
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
