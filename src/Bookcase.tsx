import { ForwardedRef, forwardRef, useEffect, useState } from 'react';
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

export const Bookcase = forwardRef<HTMLDivElement, Props>(
  ({ onDelete }: Props, ref: ForwardedRef<HTMLDivElement>) => {
    const [shelfCount, setShelfCount] = useState(2);
    const [ladderHeight, setLadderHeight] = useState(208);
    const [distribution, setDistribution] = useState(distributeItems(shelfCount, ladderHeight));
    const availableHoles = distribution.filter((v) => v === 0).length;
    const maxShelves = Math.floor(availableHoles / 2);

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
      <div className="bookcase" ref={ref}>
        <div className="bookcase-ladder">
          {distribution.map((v, idx, arr) => {
            const shelfClasses = clsx('bookcase-shelf', v < 1 && 'bookcase-shelf--hidden');
            const nextIdx = arr.slice(idx + 1).findIndex((v) => v === 1);
            const prevIdx = arr
              .slice(0, idx)
              .reverse()
              .findIndex((v) => v === 1);
            const distance = nextIdx * 5 + 3;
            if (idx === arr.length - 1)
              return <div key={`shelf-${idx}`} className="bookcase-shelf bookcase-shelf--last" />;
            return (
              <div key={`shelf-${idx}`} className={shelfClasses}>
                {idx !== arr.length - 2 && v > 0 && (
                  <div
                    className="bookcase-holes"
                    style={{ marginTop: `${((nextIdx - 1) * 1.375) / 2}vh` }}
                  >
                    {idx !== 0 && (
                      <button
                        onClick={() => handleShelfMove(idx, -1)}
                        tabIndex={-1}
                        disabled={prevIdx < 3}
                      >
                        &uarr;
                      </button>
                    )}
                    <span>
                      {nextIdx} holes ({distance} cm)
                    </span>
                    {idx !== 0 && (
                      <button
                        onClick={() => handleShelfMove(idx, +1)}
                        tabIndex={-1}
                        disabled={nextIdx < 3}
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
        <button className="bookcase-delete" onClick={onDelete} tabIndex={-1}>
          <TrashIcon />
        </button>
        <div className="bookcase-footer">
          <label>
            Shelves
            <div className="stepper">
              <button
                disabled={shelfCount <= 2}
                onClick={() => setShelfCount(shelfCount - 1)}
                tabIndex={-1}
              >
                <MinusIcon />
              </button>
              <input
                type="number"
                value={shelfCount || ''}
                min={2}
                max={maxShelves}
                onChange={(e) => setShelfCount(Number(e.target.value))}
              />
              <button
                disabled={shelfCount >= maxShelves}
                onClick={() => setShelfCount(shelfCount + 1)}
                tabIndex={-1}
              >
                <PlusIcon />
              </button>
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
      </div>
    );
  }
);
