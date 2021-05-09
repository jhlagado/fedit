import React from 'react';
import { Header } from './header';
import { Main } from './main';

export const FEdit = () => {
  return (
    <div className="flex flex-col h-screen bg-black">
      <Header />
      <Main />
    </div>
  );
};
