import React, { useState } from 'react';
import { EditRow } from './edit-row';
import { Select, Word } from './types';
import { useEventListener } from './util';

const moveLeft = (shift: boolean, sel: Select): Select => {
  if (shift) {
    const val = sel.count > 0 ? sel.count - 1 : sel.count;
    return { from: sel.from, count: val, editing: false };
  }
  const val = sel.from > 0 ? sel.from - 1 : sel.from;
  return { from: val, count: 0, editing: false };
};

const moveRight = (shift: boolean, sel: Select, length: number): Select => {
  if (shift) {
    const val = sel.from + sel.count < length ? sel.count + 1 : sel.count;
    return { from: sel.from, count: val, editing: false };
  }
  const val = sel.from < length ? sel.from + 1 : sel.from;
  return { from: val, count: 0, editing: false };
};

const spliceWord = (
  words: string[],
  from: number,
  count: number,
  key?: string,
) => {
  const w = [...words];
  if (key) w.splice(from, count, key);
  else w.splice(from, count);
  return w;
};

interface EditPanelProps {}

export const EditPanel = ({}: EditPanelProps) => {
  const [select, setSelect] = useState<Select>({
    from: 1,
    count: 0,
    editing: false,
  });
  const [words, setWords] = useState<Word[]>([
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '+',
  ]);

  const editingKeydown = (event: any) => {
    const { key } = event;
    if (key === ' ' || key === 'Enter' || key === 'Escape') {
      event.stopPropagation();
      setSelect({ from: select.from + 1, count: 0, editing: false });
    }
  };

  const nonEditingKeydown = (event: any) => {
    const { key, shiftKey } = event;
    switch (key) {
      case 'ArrowLeft':
        setSelect(moveLeft(shiftKey === true, select));
        break;
      case 'ArrowRight':
        setSelect(moveRight(shiftKey === true, select, words.length));
        break;
      case '27':
      case 'Escape':
        setSelect({ from: select.from, count: 0, editing: false });
        break;
      case 'Space':
      case ' ':
        break;
      case 'Enter':
        setSelect({ from: select.from, count: 0, editing: true });
        break;
      case 'Delete':
        break;
      case 'Backspace':
        if (select.from > 0) {
          setWords(spliceWord(words, select.from - 1, 1));
          setSelect({ from: select.from - 1, count: 0, editing: false });
        }
        break;
      default:
        console.log(key);
        if (key.length === 1) {
          setWords(spliceWord(words, select.from, select.count, ' '));
          setSelect({ from: select.from, count: 0, editing: true });
        }
    }
  };

  const handleKeydown = (event: any) => {
    if (select.editing) {
      editingKeydown(event);
    } else {
      nonEditingKeydown(event);
    }
  };

  const handleFocus = (index: number) => {
    setSelect({ from: index, count: 0, editing: true });
  };

  const handleBlur = () => {
    setSelect({ from: select.from, count: 0, editing: false });
  };

  const handleEditUpdate = (text: string) => {
    if (select.editing) {
      words[select.from] = text;
      setWords([...words]);
    }
  };

  useEventListener('keydown', handleKeydown);

  return (
    <div className="p-4 flex-grow bg-black">
      <EditRow
        words={words}
        sel={select}
        editing={select.editing}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onEditUpdate={handleEditUpdate}
      />
    </div>
  );
};
