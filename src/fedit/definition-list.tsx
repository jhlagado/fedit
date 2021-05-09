import React, { FC } from 'react';
import { DefinitionItem } from './definition-item';

export type Definition = string;

export interface DefinitionListProps {
  definitions: Definition[];
}

export const DefinitionList: FC<DefinitionListProps> = ({
  definitions,
}: DefinitionListProps) => {
  return (
    <div className="flex">
      {definitions.map((def, index) => (
        <DefinitionItem key={def + index}>{def}</DefinitionItem>
      ))}
    </div>
  );
};
