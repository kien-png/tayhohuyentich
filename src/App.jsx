import React from 'react';
import TayHoGame from './components/TayHoGame';

function App() {
  return (
    <div className="min-h-screen w-full bg-[#0e0705] text-slate-100 flex flex-col select-none">
      <main className="flex-grow flex flex-col w-full h-screen">
        <TayHoGame />
      </main>
    </div>
  );
}

export default App;

