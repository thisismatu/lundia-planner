import { FC, KeyboardEvent } from 'react';
import MinusIcon from './assets/minus.svg?react';
import PlusIcon from './assets/plus.svg?react';
import './Stepper.css';

interface Props {
  onChange: (value: number) => void;
  value: number;
  minValue?: number;
  maxValue?: number;
}

export const Stepper: FC<Props> = ({ onChange, value, minValue, maxValue }) => {
  const handleChange = (nextValue: number) => {
    if (isNaN(nextValue) || nextValue < 0) return;
    onChange(nextValue);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      if (maxValue && value + 1 > maxValue) return;
      return handleChange(value + 1);
    }
    if (e.key === 'ArrowDown') {
      if (minValue && value - 1 < minValue) return;
      return handleChange(value - 1);
    }
  };

  return (
    <div className="stepper">
      <button
        disabled={minValue ? value <= minValue : false}
        onClick={() => onChange(value - 1)}
        tabIndex={-1}
      >
        <MinusIcon />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value || ''}
        minLength={minValue?.toString().length}
        maxLength={maxValue?.toString().length}
        onChange={(e) => handleChange(Number(e.target.value))}
        onKeyDown={handleKeyPress}
      />
      <button
        disabled={maxValue ? value >= maxValue : false}
        onClick={() => onChange(value + 1)}
        tabIndex={-1}
      >
        <PlusIcon />
      </button>
    </div>
  );
};
