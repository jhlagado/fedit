import React, {
  ChangeEvent,
  FC,
  FocusEventHandler,
  MouseEventHandler,
} from 'react';
import { classnames } from 'tailwindcss-classnames';

interface WordBoxProps {
  text: string;
  selected: boolean;
  focused: boolean;
  onClick: MouseEventHandler<HTMLElement>;
  onBlur: FocusEventHandler<HTMLElement>;
  onEditUpdate: (text: string) => void;
}

export const WordBox: FC<WordBoxProps> = ({
  text,
  selected,
  focused,
  onClick,
  onBlur,
  onEditUpdate,
}: WordBoxProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onEditUpdate(event.currentTarget.value);
  };

  const style =
    classnames(
      'inline-block',
      'px-2',
      'py-1',
      'mx-1',
      'my-1',
      'rounded-md',
      'border-white',
      'font-bold',
      'text-lg',
      focused ? 'border-4' : 'border-2',
      selected ? 'text-black' : 'text-white',
      selected ? 'bg-blue-200' : 'bg-green-800',
    ) + ' cursor';
  return (
    <div onClick={onClick} className={style}>
      {focused ? (
        <input
          autoFocus
          className="bg-transparent"
          type="text"
          value={text}
          onBlur={onBlur}
          onChange={handleChange}
        />
      ) : (
        text
      )}
    </div>
  );
};
