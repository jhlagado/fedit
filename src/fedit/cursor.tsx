import React from 'react';
import { FC } from 'react';
import { classnames } from 'tailwindcss-classnames';

interface CursorProps {}

export const Cursor: FC<CursorProps> = ({}: CursorProps) => {
  const style =
    classnames('inline-block', 'px-1', 'py-4', 'mx-1', 'my-1', 'bg-white') +
    ' cursor';
  return <div className={style} />;
};
