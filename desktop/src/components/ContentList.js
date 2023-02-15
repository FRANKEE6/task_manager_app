// Import dependencies
import React, { useState, useEffect } from "react";

// Component function start
const ContentList = (props) => {
    // Get tasks from props
    const tasks = props.tasks;
    
    const [liValues, setLiValues] = useState(""); // Create state for component so we can adjust value of text input

    // Everytime we recieve new props we will update our state with those values
    useEffect(() => {
      let data = tasks
      setLiValues(data);
    }, [props])
    
    
    // Function handling submit of new text value of task
    function handleTextSub(event){
        event.preventDefault()          // Prevent page reaload

        document.activeElement.blur();  // Blur marked input, which will trigger OnBlur fuction of input element (that function sends all data to parent)
    }

    // Adjust state on text change in imput
    const handleTextChange = (event, id) => {
        let taskTextEdit = liValues.map((task) => {
            if (task.id === id) {
            // On match, substitiue text with new one
            let newText = String(event.target.value);
            task = { ...task, text: newText };
            }
            // Return our updated array of tasks
            return task;
          });
          
          setLiValues(taskTextEdit);
    }


    // Let urer know we have no tasks added
    if(liValues.length === 0){
        return (
            <p>
                Add your first task please
            </p>
        )
    }

    else {
        return (
            <ul>
            
            {liValues.map(task => (
                <li key={task.id}>
                    <form 
                    id={"task-" + task.id}
                    onSubmit={handleTextSub}
                    className={task.done === false ? '' : 'faded'}
                    >
                        <div className="wrapper">
                        <input 
                        type="checkbox" 
                        checked={task.done === false ? '' : 'checked'}
                        onChange={() => props.onEdit(task.id, "check-change")}
                        
                        />

                        <input 
                        type="text" 
                        value={task.text}
                        onChange={(event) => handleTextChange(event, task.id)}
                        onBlur={() => props.onEdit(task.id, "edit-text", task.text)}
                        />
                        </div>

                        <input 
                        type="button" 
                        value="X" 
                        onClick={() => props.onEdit(task.id, "delete")}/>

                    </form>
                </li>
            ))}

        </ul>
        )
    }
};

// Export component
export default ContentList;