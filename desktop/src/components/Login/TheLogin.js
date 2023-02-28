/**
 *  Imports
 */
// Import dependencies
import React, {useState} from "react";

// Import our custom components
import LoginLogin from "./LoginLogin";
import LoginRegister from "./LoginRegister";
//_________________________________________________________

/**
 *  Component function start
 */
const TheLogin = (props) => {

  /**
   *  Data section
   */
   const [registeredUser, setregisteredUser] = useState(true); // Is user already registered?
   //_______________________________________________________

  /**
   *  Functions section
   */
  const handleRegisterButton = () => {
    setregisteredUser(false);
  }

  const handleBackButton = () => {
    setregisteredUser(true);
  }

  const userRegistered = (signedUp) => {
    setregisteredUser(signedUp)
  }

  const userLoggedStatus = (loggedIn) => {
    props.loginStatus(loggedIn);
  }
  //_______________________________________________________

    /**
     *  DOM model section
     */
    if(registeredUser){
        return (
            <section>
                <h2>Please log in to access this page</h2>
                <LoginLogin loggedIn={userLoggedStatus} />
                <p>Don't have an account? Click on register down below.</p>
                <button onClick={handleRegisterButton} className="switch-button">Register</button>
            </section>
        );
    }
    else {
        return (
            <section>
                <h2>Register new account</h2>
                <LoginRegister signedUp={userRegistered}/>
                <button onClick={handleBackButton} className="switch-button">Back to login</button>
            </section>
        );
    }
  //________________________________________________________
};
//_#Component_function_end__________________________________

// Export our component
export default TheLogin;