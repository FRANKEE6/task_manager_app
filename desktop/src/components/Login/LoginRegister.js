/**
 *  Imports
 */
// Import dependencies
import React, {useRef, useState, useEffect} from 'react'

// Import packages
import axios from "../../api/axios";
import {hashWithKeccak256} from "node-hash-password"

/**
 *  Other data
 */
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,20}$/;
const PSWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#&$%]).{8,25}$/;
//_________________________________________________________

/**
 *  Component function start
 */
const LoginRegister = (props) => {
  const userRef = useRef();
  const errRef = useRef();

  /**
   *  Data section
   */
  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pswd, setPswd] = useState("");
  const [validPswd, setValidPswd] = useState(false);
  const [pswdFocus, setPswdFocus] = useState(false);

  const [matchPswd, setMatchPswd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  //_______________________________________________________
  
  /**
   *  use Effect section
   */
  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    let result = USER_REGEX.test(user);
    setValidName(result);
  }, [user])

  useEffect(() => {
    let result = PSWD_REGEX.test(pswd);
    setValidPswd(result);
    let match = pswd === matchPswd
    setValidMatch(match);
  }, [pswd, matchPswd])

  useEffect(() => {
    setErrMsg("");
  }, [user, pswd, matchPswd])
  
  //_______________________________________________________
  
  /**
   *  Functions section
   */
  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    
    let v1 = USER_REGEX.test(user),
        v2 = PSWD_REGEX.test(pswd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      let hashedPswd = JSON.stringify(hashWithKeccak256({ password: pswd }));
      const response = await axios.post("/register", JSON.stringify({user, hashedPswd}),{
        headers: {"Content-type": "application/json"},
      }
      );
      props.signedUp(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No server response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username taken");
      } else {
        setErrMsg("Registration Failed")
      }
      errRef.current.focus();
    }
  }
  //_______________________________________________________

  /**
   *  DOM model section
   */
  return (
    <>
    <p ref={errRef} className={errMsg ? "msg" : "offscreen"} >
      {errMsg}
    </p>
    <form onSubmit={handleSignUpSubmit} className="register-form">
      <label htmlFor='username'>
        Username:
      </label>
      <input
        type="text"
        className={!validName && user ? "invalid" : "registerInput"}
        id="username"
        ref={userRef}
        autoComplete="off"
        onChange={(e) => setUser(e.target.value)}
        required
        aria-describedby='uidnote'
        onFocus={() => setUserFocus(true)}
        onBlur={() => setUserFocus(false)}
      />
      <p id='uidnote' className={userFocus && user && !validName ? "instructions" : "offscreen"} >
        4 to 21 characters.<br />
        Must begin with a letter.<br />
        Letters, number, underscores, hyphens allowed.
      </p>

      <label htmlFor='password'>
        Password:
      </label>
      <input
        type="password"
        className={!validPswd && pswd ? "invalid" : "registerInput"}
        id="password"
        onChange={(e) => setPswd(e.target.value)}
        required
        aria-describedby='pswdnote'
        onFocus={() => setPswdFocus(true)}
        onBlur={() => setPswdFocus(false)}
      />
      <p id='pswdnote' className={pswdFocus && !validPswd ? "instructions" : "offscreen"} >
        8 to 25 characters.<br />
        Must include uppercase and lowercase letters, a nuber and a special character.<br />
        Allowed special characters: ! @ # & $ %
      </p>

      <label htmlFor='confirm_pswd'>
        Confirm password:
      </label>
      <input
        type="password"
        className={!validMatch && matchPswd ? "invalid" : "registerInput"}
        id="confirm_pswd"
        onChange={(e) => setMatchPswd(e.target.value)}
        required
        aria-describedby='confirmnote'
        onFocus={() => setMatchFocus(true)}
        onBlur={() => setMatchFocus(false)}
      />
      <p id='confirmnote' className={matchFocus && !validMatch ? "instructions" : "offscreen"} >
        Must match first password field.
      </p>

      <input
        type="submit"
        value="Sign Up"
        className="submit-button"
        disabled={!validName || !validPswd || !validMatch ? true : false}
      />
    </form>
    </>
  )
  //________________________________________________________
};
//_#Component_function_end__________________________________

export default LoginRegister