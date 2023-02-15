import React from 'react';
import TheContent from "./components/TheContent";
import './App.scss';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Simple TaskManager</h1>
      </header>
      <main>
        <TheContent />
      </main>

    </div>
  );
}

export default App;
