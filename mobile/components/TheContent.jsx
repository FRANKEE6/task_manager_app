/**
 *  Imports
 */
// Import dependencies
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";

// Import npm package
import axios from "axios";
import io from "socket.io-client";

// Import our custom components
import ContentAddForm from "./ContentAddForm.jsx";
import ContentList from "./ContentList";
//_________________________________________________________

/**
 *  Other data
 */
// Rest API url
const url = "http://10.0.2.2:3500/";
// Connect to Api socket url
const socket = io.connect("http://10.0.2.2:3500");
//_________________________________________________________

/**
 *  Component function start
 */
const TheContent = () => {
  /**
   *  State section
   */
  const [tasks, setTasks] = useState([]); // Define state which will hold our tasks data
  //_______________________________________________________

  /**
   *  use Effect section
   */
  // Connect to our socket only on first render and collect data
  useEffect(() => {
    // Uppon connection api will send us all data
    socket.on("init", (data) => {
      if (!data) return; // If there are no tasks in data, return
      data = JSON.parse(data); // Parse our data from Json
      setTasks(data); // Save data to state
    });
  }, []);

  // Only when socket is communicating run this code which recieves update of data
  useEffect(() => {
    // When socket emmits fresh data message it will send us updated dataset
    socket.on("fresh_data", (data) => {
      data = JSON.parse(data); // Parse our data from Json
      setTasks(data); // Save data to state
    });
  }, [socket]);
  //_______________________________________________________

  /**
   *  Functions section
   */
  /**
   * Function being called by prop when new task is added in ContentAddForm component
   * @param {string} addString
   * @returns {void}
   */
  const handleNewTask = (addString) => {
    let text = JSON.stringify(addString); // Make our new task text json
    let jsonData = { text }; // Wrap our json text as obj

    // Send data to API
    axios
      .post(`${url}add`, jsonData, {
        // Need to define content-type so API know that Json is being sent
        headers: {
          "Content-Type": "application/json",
        },
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
        alert("Sorry, something went wrong"); // Alert user that add request failed
      })
      .then(() => {
        socket.emit("update_data"); // After data update, let socket know about it
      });
  };

  /**
   *  Function being called by prop wwhen existing task was edited
   * @param {int} id - The id of task
   * @param {string} action - Type of action to be done ("check-change", "edit-text", "delete")
   * @param {string} [newText=""] - New text value for "edit-text" action, default is empty string
   * @returns {void}
   */
  const handleTaskChange = (id, action, newText = "") => {
    // If user want to edit text, but provided no text or just whitespaces stop function
    if (action === "edit-text" && newText.trim().length === 0) return;

    // Creating Json object. But there surely must be better way to do so :D
    id = JSON.stringify(id);
    action = JSON.stringify(action);
    let jsonData = {};

    jsonData["id"] = id;
    jsonData["action"] = action;
    jsonData["text"] = newText;
    jsonData = JSON.stringify(jsonData);

    // Send data to API
    axios
      .post(`${url}tasks`, jsonData, {
        // Need to define content-type so API know that Json is being sent
        headers: {
          "Content-Type": "application/json",
        },
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
        alert("Sorry, something went wrong");
      })
      .then(() => {
        socket.emit("update_data"); // After data update, let socket know about it
      });
  };
  //________________________________________________________

  /**
   *  DOM model section
   */
  return (
    <>
      <View style={styles.addForm}>
        <ContentAddForm onSearch={handleNewTask} />
      </View>
      <View>
        <ContentList tasks={tasks} onEdit={handleTaskChange} />
      </View>
    </>
  );
  //________________________________________________________
};
//_#Component_function_end__________________________________

/**
 *  Styles section
 */
const styles = StyleSheet.create({
  addForm: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 15,
  },
});
//_____________________________________________________________

// Export our component
export default TheContent;
