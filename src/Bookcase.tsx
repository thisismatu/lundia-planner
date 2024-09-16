import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  useEffect,
  useState,
} from "react";
import clsx from "clsx";
import { Trash2Icon } from "lucide-react";
import { Stepper } from "./Stepper";
import "./Bookcase.css";

interface Props {
  onDelete: () => void;
  onUpdate: (height: number, width: number) => void;
  initialHeight: number;
  initialWidth: number;
}

const edgeOffset = 3;
const ratio = 5;
const ladders = [48, 68, 78, 108, 148, 188, 208, 218, 228, 248];
const widths = [50, 80, 100];

function distributeItems(shelfCount: number, ladderHeight: number): number[] {
  const holeCount = Math.round((ladderHeight - edgeOffset) / ratio);
  const result: number[] = Array(holeCount).fill(0);

  result[0] = 1;
  result[holeCount - 1] = 1;
  shelfCount--;

  const emptySlotsBetweenItems = Math.round((holeCount - 2) / shelfCount);
  for (
    let i = 1, j = emptySlotsBetweenItems;
    i < shelfCount;
    i++, j += emptySlotsBetweenItems
  ) {
    result[j] = 1;
  }

  result.push(0);
  return result;
}

export const Bookcase = forwardRef<HTMLDivElement, Props>(
  (
    { onDelete, onUpdate, initialHeight, initialWidth }: Props,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const [shelfCount, setShelfCount] = useState(2);
    const [ladderHeight, setLadderHeight] = useState(initialHeight);
    const [shelfWidth, setShelfWidth] = useState(initialWidth);
    const [distribution, setDistribution] = useState(
      distributeItems(shelfCount, ladderHeight),
    );
    const availableHoles = distribution.filter((v) => v === 0).length;
    const minShelves = 2;
    const maxShelves = Math.floor(availableHoles / 2);

    useEffect(() => {
      if (!ladderHeight || !shelfCount) return;
      const asd =
        shelfCount < minShelves
          ? minShelves
          : shelfCount > maxShelves
            ? maxShelves
            : shelfCount;
      const dist = distributeItems(asd, ladderHeight);
      setDistribution(dist);
    }, [ladderHeight, maxShelves, shelfCount]);

    useEffect(() => {
      if (!ladderHeight) return;
      setShelfCount(2);
    }, [ladderHeight]);

    const handleLadderChange = (e: ChangeEvent<HTMLSelectElement>) => {
      const height = Number(e.target.value);
      setLadderHeight(height);
      onUpdate(height, shelfWidth);
    };

    const handleShelfChange = (e: ChangeEvent<HTMLSelectElement>) => {
      const width = Number(e.target.value);
      setShelfWidth(width);
      onUpdate(ladderHeight, width);
    };

    const handleShelfMove = (currIdx: number, change: number) => {
      const newDist = [...distribution];
      newDist[currIdx] = 0;
      newDist[currIdx + change] = 1;
      setDistribution(newDist);
    };

    return (
      <div className="bookcase" ref={ref}>
        <div className={`bookcase-ladder bookcase-ladder--${shelfWidth}`}>
          {distribution.map((v, idx, arr) => {
            const shelfClasses = clsx(
              "bookcase-shelf",
              v < 1 && "bookcase-shelf--hidden",
            );
            const nextIdx = arr.slice(idx + 1).findIndex((v) => v === 1);
            const prevIdx = arr
              .slice(0, idx)
              .reverse()
              .findIndex((v) => v === 1);
            const distance = nextIdx * 5 + 3;
            if (idx === arr.length - 1)
              return (
                <div
                  key={`shelf-${idx}`}
                  className="bookcase-shelf bookcase-shelf--last"
                />
              );
            return (
              <div key={`shelf-${idx}`} className={shelfClasses}>
                {idx !== arr.length - 2 && v > 0 && (
                  <div
                    className="bookcase-holes"
                    style={{ marginTop: `${((nextIdx - 1) * 1.375) / 2}vh` }}
                  >
                    {idx !== 0 && (
                      <button
                        onMouseDown={() => handleShelfMove(idx, -1)}
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
                        onMouseDown={() => handleShelfMove(idx, +1)}
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
          <Trash2Icon />
        </button>
        <div className="bookcase-footer">
          <Stepper
            value={shelfCount}
            onChange={setShelfCount}
            minValue={minShelves}
            maxValue={maxShelves}
          />
          <select
            className="select"
            value={shelfWidth}
            onChange={handleShelfChange}
          >
            <option disabled>Width</option>
            {widths.map((w) => (
              <option key={`shelft-${w}`} value={w}>
                {w} cm
              </option>
            ))}
          </select>
          <select
            className="select"
            value={ladderHeight}
            onChange={handleLadderChange}
          >
            <option disabled>Height</option>
            {ladders.map((h) => (
              <option key={`ladder-${h}`} value={h}>
                {h} cm
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  },
);
