/**
 *  Imports
 */
// Import dependencies
import React, {useState} from 'react';

// Import our custom components
import TheContent from "./components/Content/TheContent";
import TheLogin from "./components/Login/TheLogin";

// Import styles
import './App.scss';

const App = () => {
  /**
   *  Data section
   */
  const [logged, setLogged] = useState(false); // Logged user boolean
  //_______________________________________________________

  /**
   *  Functions section
   */
  const userLoggedStatus = (loginStatus) => {
    setLogged(loginStatus);
  }
  //_______________________________________________________

  if (logged){
  return (
    <div className="App">
      <header>
        <h1>Simple TaskManager</h1>
      </header>
      <main>
        <TheContent loginStatus={userLoggedStatus} authorizedUser={logged}/>
      </main>
    </div>
  );}
  else {
    return (
      <div className="App">
        <header>
          <h1>Simple TaskManager</h1>
        </header>
        <main>
          <TheLogin loginStatus={userLoggedStatus}/>
        </main>
      </div>
    );
  }
}

export default App;
