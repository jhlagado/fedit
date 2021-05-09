import React, { FC, Fragment } from 'react';
import { Cursor } from './cursor';
import { Select } from './types';
import { WordBox } from './word-box';

type Word = string;

interface EditRowProps {
  sel: Select;
  editing: boolean;
  words: Word[];
  onFocus: (index: number) => void;
  onBlur: () => void;
  onEditUpdate: (text: string) => void;
}

export const EditRow: FC<EditRowProps> = ({
  words,
  sel: selected,
  editing,
  onFocus,
  onBlur,
  onEditUpdate,
}: EditRowProps) => {
  const handleClick = (index: number) => () => {
    onFocus(index);
  };

  return (
    <div className="flex">
      <>
        {words.map((word, index) => (
          <Fragment key={index}>
            {index === selected.from && <Cursor />}
            <WordBox
              key={index}
              onClick={handleClick(index)}
              onEditUpdate={onEditUpdate}
              onBlur={onBlur}
              focused={editing && selected.from === index}
              selected={
                index >= selected.from && index < selected.from + selected.count
              }
              text={word}
            >
              {word}
            </WordBox>
          </Fragment>
        ))}
        {selected.from >= words.length && <Cursor />}
      </>
    </div>
  );
};
