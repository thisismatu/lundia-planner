import { FC, useEffect, useState } from 'react';
import TrashIcon from './assets/trash-2.svg?react';
import './Bookcase.css';

interface Props {
  onDelete?: () => void;
}

const ratio = 4.85714;
const ladders = [48, 68, 78, 108, 148, 188, 208, 218, 228, 248];

function distributeItems(shelfCount: number, ladderHeight: number): number[] {
  const holeCount = Math.round(ladderHeight / ratio) - 1;
  const result: number[] = Array(holeCount).fill(0);

  result[0] = 1;
  result[holeCount - 1] = 1;
  shelfCount--;

  const emptySlotsBetweenItems = Math.floor((holeCount - 2) / shelfCount);
  for (let i = 1, j = emptySlotsBetweenItems; i < shelfCount; i++, j += emptySlotsBetweenItems) {
    result[j] = 1;
  }
  result.push(0);

  return result;
}

export const Bookcase: FC<Props> = ({ onDelete }) => {
  const [shelfCount, setShelfCount] = useState(2);
  const [ladderHeight, setLadderHeight] = useState(208);
  const [distribution, setDistribution] = useState(distributeItems(shelfCount, ladderHeight));
  const availableHoles = distribution.filter((v) => v === 0).length;

  useEffect(() => {
    if (!ladderHeight || !shelfCount) return;
    const dist = distributeItems(shelfCount, ladderHeight);
    setDistribution(dist);
  }, [ladderHeight, shelfCount]);

  useEffect(() => {
    if (!ladderHeight) return;
    setShelfCount(2);
  }, [ladderHeight]);

  const handleShelfMove = (currIdx: number, change: number) => {
    const newDist = [...distribution];
    newDist[currIdx] = 0;
    newDist[currIdx + change] = 1;
    setDistribution(newDist);
  };

  return (
    <div className="bookcase">
      <div className="bookcase-ladder">
        {distribution.map((v, idx, arr) => {
          const nextIdx = (start: number) => arr.slice(start + 1).findIndex((v) => v === 1);
          const prevIdx = (start: number) =>
            arr
              .slice(0, start)
              .reverse()
              .findIndex((v) => v === 1);
          if (idx === arr.length - 1)
            return (
              <div
                key={`shelf-${idx}`}
                className="bookcase-shelf"
                style={{ height: `4px`, opacity: v }}
              />
            );
          return (
            <div
              key={`shelf-${idx}`}
              className="bookcase-shelf"
              style={{ height: `12px`, opacity: v }}
            >
              {idx !== arr.length - 2 && (
                <div className="bookcase-holes">
                  {idx !== 0 && (
                    <button
                      onClick={() => handleShelfMove(idx, -1)}
                      tabIndex={-1}
                      disabled={prevIdx(idx) < 3}
                    >
                      &uarr;
                    </button>
                  )}
                  <span>{nextIdx(idx)} holes</span>
                  {idx !== 0 && (
                    <button
                      onClick={() => handleShelfMove(idx, +1)}
                      tabIndex={-1}
                      disabled={nextIdx(idx) < 3}
                    >
                      &darr;
                    </button>
                  )}
                </div>
              )}
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
            max={Math.round(availableHoles / 3)}
            onChange={(e) => setShelfCount(Number(e.target.value))}
          />
        </label>
        <label>
          Ladder
          <select value={ladderHeight} onChange={(e) => setLadderHeight(Number(e.target.value))}>
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
