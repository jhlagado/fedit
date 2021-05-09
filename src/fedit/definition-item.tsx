import React, { FC } from 'react';
import { classnames } from 'tailwindcss-classnames';

interface DefinitionItemProps {
  children: any;
}

export const DefinitionItem: FC<DefinitionItemProps> = ({
  children,
}: DefinitionItemProps) => {
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
      'border-2',
      'text-white',
      'bg-yellow-800',
    ) + ' cursor';

  return <div className={style}>{children}</div>;
};
