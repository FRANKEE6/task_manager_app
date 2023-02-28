/**
 *  Imports
 */
// Import dependencies
import React, {useState, useEffect} from "react";

// Import npm package
import axios from "../../api/axios";
import io from "socket.io-client";
import socketURL from "../../api/socket";


// Import our custom components
import ContentAddForm from "./ContentAddForm";
import ContentList from "./ContentList";
//_________________________________________________________

var socket;

/**
 *  Component function start
 */
const TheContent = (props) => {
    /**
     *  Data section
     */
    const [tasks, setTasks] = useState([]); // Define state which will hold our tasks data
    //_______________________________________________________

    /**
     *  use Effect section
     */
    // Connect to our socket only on first render and collect data
    useEffect(() => {
        // Uppon connection api will send us all data
        if (props.authorizedUser){
            socket = io.connect(socketURL);
            socket.on("init", (data) => {
                if (!data) return;          // If there are no tasks, return
                data = JSON.parse(data);    // Parse our data from Json
                setTasks(data);             // Save data to state
            });
        }
    }, [props.authorizedUser])

    // Only when socket is communicating run this code which recieves update of data
    useEffect(() => {
        // When socket emmits fresh data message it will send us updated dataset
        socket.on("fresh_data", (newTaskList) => {
            newTaskList = JSON.parse(newTaskList);  // Parse our data from Json
            setTasks(newTaskList);                  // Save data to state
        })
    }, [socket])
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
        let text = JSON.stringify(addString),    // Make json from recieved string
            jsonData = { text };                 // Wrap json text as obj
        
        // Send data to API
        axios
            .post(`/add`, jsonData, {
                // Need to define content-type so API know what is being sent
                headers: {
                "Content-Type": "application/json",
                },
            })
            .catch((error) => {
                console.error(`Error: ${error}`);
                alert("Sorry, something went wrong"); // Notify user that task failed
            })
            .then(() => {
                socket.emit("update_data"); // After data update, let socket know about it
            })
    }

    /**
     *  Function being called by prop wwhen existing task was edited
     * @param {int} id - The id of task
     * @param {string} action - Type of action to be done ("check-change", "edit-text", "delete")
     * @param {string} [newText = ""] - New text value for "edit-text" action
     * @returns void
     */
    const handleTaskChange = (id , action, newText="") => {
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
            .post(`/update`, jsonData, {
                // Need to define content-type so API know what is being sent
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
    }

    const userLoggedStatus = () => {
        socket.disconnect();
        props.loginStatus(false);
      }
    //_______________________________________________________

    /**
     *  DOM model section
     */
    return (
        <>
        <button className="logOffButton" type="button" onClick={userLoggedStatus}>
            Log off
        </button>
        <div className="addbar">
            <ContentAddForm onAdd={handleNewTask}/>
        </div>
        <div className="task-list">
            <ContentList tasks={tasks} onEdit={handleTaskChange}/>
        </div>
        </>
    );
  //________________________________________________________
};
//_#Component_function_end__________________________________

// Export our component
export default TheContent;