import React from 'react';
import { EditPanel } from './edit-panel';
import { Definition, DefinitionList } from './definition-list';
import { Button } from '../ui/button';

export const Main = () => {
  const definitions: Definition[] = ['x', 'y', 'z'];

  return (
    <div className="p-4 flex-grow bg-white">
      <EditPanel />
      <DefinitionList definitions={definitions} />
      <div className="space-x-1 mb-4 md:space-x-6 space-y-3">
        <Button color="primary">Primary</Button>
        <Button color="success">Success</Button>
        <Button color="danger">Danger</Button>
        <Button color="warning">Warning</Button>
        <Button color="dark">Dark</Button>
        <Button color="indigo">Indigo</Button>
      </div>
    </div>
  );
};
