import { FC, useState } from 'react';
import TrashIcon from './assets/trash-2.svg?react';
import './Bookcase.css';

interface Props {
  onDelete?: () => void;
}

const ratio = 4.85714;
const ladders = [48, 68, 78, 108, 148, 188, 208, 218, 228, 248];

export const Bookcase: FC<Props> = ({ onDelete }) => {
  const [shelfCount, setShelfCount] = useState(2);
  const [ladderHeight, setLadderHeight] = useState(208);

  const gaps = shelfCount - 1;
  const holes = Math.round(ladderHeight / ratio) - 1 - shelfCount;
  const remainder = holes % gaps;

  return (
    <div className="bookcase">
      <div className="bookcase-ladder">
        {Array.from({ length: shelfCount }, (_, i) => {
          if (i === shelfCount - 1) {
            return <div key={`shelf-${i}`} className="bookcase-shelf" style={{ height: 16 }}></div>;
          }
          const holeCount = Math.floor(holes / gaps) + (i === shelfCount - 2 ? remainder : 0);
          return (
            <div
              key={i}
              className="bookcase-shelf"
              style={{
                height: `${(holeCount + 1) * 12}px`,
              }}
            >
              <p className="bookcase-holes">{holeCount} holes</p>
            </div>
          );
        })}
      </div>
      <div className="bookcase-footer">
        <label>
          Shelves
          <input
            type="number"
            value={shelfCount || ''}
            min={2}
            max={Math.round(holes / 2)}
            onChange={(e) => setShelfCount(Number(e.target.value))}
          />
        </label>
        <label>
          Ladder
          <select
            value={ladderHeight}
            onChange={(e) => {
              setLadderHeight(Number(e.target.value));
              setShelfCount(2);
            }}
          >
            {ladders.map((h) => (
              <option key={`ladder-${h}`} value={h}>
                {h} cm
              </option>
            ))}
          </select>
        </label>
      </div>
      <TrashIcon className="bookcase-delete" onClick={onDelete} />
    </div>
  );
};
