/**
 *  Imports
 */
// Import dependencies
import React, {useRef, useState, useEffect} from 'react'

// Import packages
import axios from "../../api/axios";
//_______________________________________________________

/**
 *  Component function start
 */
const LoginLogin = (props) => {
  /**
   *  Data section
   */
  const userRef = useRef();
  const infRef = useRef();

  const [infMsg, setInfMsg] = useState("");

  const [user, setUser] = useState("");

  const [pswd, setPswd] = useState("");
    //_______________________________________________________

  /**
   *  use Effect section
   */
  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setInfMsg("");
  }, [user, pswd])
  //_______________________________________________________

  /**
   *  Functions section
   */
  const handleLogInSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/login", JSON.stringify({user, pswd}),{
        headers: {"Content-type": "application/json"},
      }
      )
      .then((response) => {
        if(response.status === 200){
          props.loggedIn(true);
        }
      });
    } catch (err) {
      if (!err?.response) {
        setInfMsg("No server response");
      } else if (err.response?.status === 403) {
        setInfMsg("Incorrect username or password");
      } else {
        setInfMsg("Failed to log in")
      }
      infRef.current.focus();
    }
  }
  //_______________________________________________________

  /**
   *  DOM model section
   */
  return (
    <>
      <p ref={infRef} className={infMsg ? "msg" : "offscreen"} >
        {infMsg}
      </p>
      
      <form onSubmit={handleLogInSubmit} className="login-form">
      <label htmlFor='username'>
        Username:
      </label>
      <input
        type="text"
        id="username"
        ref={userRef}
        autoComplete="on"
        onChange={(e) => setUser(e.target.value)}
        required
      />

      <label htmlFor='password'>
        Password:
      </label>
      <input
        type="password"
        id="password"
        onChange={(e) => setPswd(e.target.value)}
        required
      />

      <input
        type="submit"
        value="Log in"
        className="submit-button"
        disabled={!user || !pswd ? true : false}
      />
      </form>
    </>
  )
  //________________________________________________________
};
//_#Component_function_end__________________________________

export default LoginLogin