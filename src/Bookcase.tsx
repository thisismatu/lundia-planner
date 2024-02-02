import { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import TrashIcon from './assets/trash-2.svg?react';
import MinusIcon from './assets/minus.svg?react';
import PlusIcon from './assets/plus.svg?react';
import './Bookcase.css';

interface Props {
  onDelete?: () => void;
}

const edgeOffset = 3;
const ratio = 5;
const ladders = [48, 68, 78, 108, 148, 188, 208, 218, 228, 248];

function distributeItems(shelfCount: number, ladderHeight: number): number[] {
  const holeCount = Math.round((ladderHeight - edgeOffset) / ratio);
  const result: number[] = Array(holeCount).fill(0);

  result[0] = 1;
  result[holeCount - 1] = 1;
  shelfCount--;

  const emptySlotsBetweenItems = Math.round((holeCount - 2) / shelfCount);
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
  const maxShelves = Math.round(availableHoles / 3);

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
          const shelfClasses = clsx('bookcase-shelf', v < 1 && 'bookcase-shelf--hidden');
          const nextIdx = (start: number) => arr.slice(start + 1).findIndex((v) => v === 1);
          const prevIdx = (start: number) =>
            arr
              .slice(0, start)
              .reverse()
              .findIndex((v) => v === 1);
          if (idx === arr.length - 1)
            return <div key={`shelf-${idx}`} className="bookcase-shelf bookcase-shelf--last" />;
          return (
            <div key={`shelf-${idx}`} className={shelfClasses}>
              {idx !== arr.length - 2 && v > 0 && (
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
          <div className="stepper">
            <MinusIcon onClick={() => shelfCount > 2 && setShelfCount(shelfCount - 1)} />
            <input
              type="number"
              value={shelfCount || ''}
              min={2}
              max={maxShelves}
              onChange={(e) => setShelfCount(Number(e.target.value))}
            />
            <PlusIcon onClick={() => shelfCount < maxShelves && setShelfCount(shelfCount + 1)} />
          </div>
        </label>
        <label>
          Ladder
          <select
            className="select"
            value={ladderHeight}
            onChange={(e) => setLadderHeight(Number(e.target.value))}
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
