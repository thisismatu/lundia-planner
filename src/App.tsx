import { useEffect, useRef, useState } from 'react';
import { Plus as PlusIcon } from 'lucide-react';
import { Bookcase } from './Bookcase';
import Logo from './assets/logo.svg?react';
import './App.css';

function App() {
  const [bookcases, setBookcases] = useState([{ id: crypto.randomUUID(), height: 208 }]);
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
        {bookcases.length > 0 && (
          <div className="totalWidth">Width: {bookcases.length * 80 + 4} cm</div>
        )}
        <button
          className="header-button"
          onClick={() =>
            setBookcases((curr) => [
              ...curr,
              { id: crypto.randomUUID(), height: curr[curr.length - 1]?.height || 208 },
            ])
          }
          disabled={bookcases.length > 7}
        >
          <PlusIcon />
          <span>Add bookcase</span>
        </button>
      </header>
      <div className="scroll-container" dir="ltr">
        <div className="container">
          {bookcases.map(({ id, height }) => (
            <Bookcase
              ref={bookcaseRef}
              key={`case-${id}`}
              initialHeight={height}
              onDelete={() => setBookcases(bookcases.filter((b) => b.id !== id))}
              onUpdate={(height) =>
                setBookcases(bookcases.map((b) => (b.id === id ? { ...b, height } : b)))
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
