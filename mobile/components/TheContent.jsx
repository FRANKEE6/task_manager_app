// Import dependencies
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";

// Import npm package
import axios from "axios";
import io from "socket.io-client";

// Import our custom components
import ContentSearchForm from "./ContentSearchForm.jsx";
import ContentList from "./ContentList";

// Rest API url
const url = "http://10.0.2.2:3500/";

const socket = io.connect("http://10.0.2.2:3500");

// Component function start
const TheContent = () => {
  // Define state which will hold our tasks data
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    socket.on("init", (data) => {
      if (!data) return; // If there are no tasks, return
      data = JSON.parse(data); // Parse our data from Json
      setTasks(data); // Save data to state
    });

    socket.on("fresh_data", (data) => {
      data = JSON.parse(data);
      setTasks(data);
    });
  }, [socket]);

  // Function being called by prop when new task is added in ContentSearchForm component
  function handleNewTask(searchString) {
    let text = JSON.stringify(searchString); // Make our new task text json
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
        socket.emit("update_data");
      });
  }

  /**
   *  Function being called by prop wwhen existing task was edited
   * @param {int} id - The id of task
   * @param {string} action - Type of action to be done ("check-change", "edit-text", "delete")
   * @param {string} [newText = ""] - New text value for "edit-text" action
   * @returns void
   */
  function handleTaskChange(id, action, newText = "") {
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
        socket.emit("update_data");
      });
  }

  return (
    <>
      <View style={styles.searchForm}>
        <ContentSearchForm onSearch={handleNewTask} />
      </View>
      <View>
        <ContentList tasks={tasks} onEdit={handleTaskChange} />
      </View>
    </>
  );
};

// Styles for component
const styles = StyleSheet.create({
  searchForm: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 15,
  },
});

// Export our component
export default TheContent;
