/**
 *  Imports and setup
 */
//file system package - promises version
const fsp = require("fs/promises");
const fs =  require("fs");

//web server
const express = require("express");

//cross origin resource sharing
const cors = require("cors");

//server setup
const app = express();

//create websocket server
const { Server } = require('socket.io');

const server = require("http").createServer(app);

//allow json usage
app.use(express.json());

//make cross origin resource sharing possible
app.use(cors());

//define settings of io socket
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
//_______________________________________________

/**
 *  Socket section
 */
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`)     //Log id of connected user
  let tasks;
  tasks = fs.readFileSync(`data.json`, "utf-8");  //Retrive data from file
  socket.emit("init", tasks);                     //Send dataset to this user

  // When any user updates data successfully, he will send us "update_data" message
  socket.on("update_data", () => {
    let freshData;
    freshData = fs.readFileSync(`data.json`, "utf-8");  //Retrieve data from file
    io.sockets.emit("fresh_data", freshData)            //Send new dataset to all connected users including sender
  });
})
//_______________________________________________


/**
 *  REST section
 */
// Upon recieving post request on /update
app.post("/update", async (req, res) => {
    // Recieve and save data to variable
    let id = req.body.id,
        action = req.body.action,
        newText = req.body.text,
        tasks;


    // If we fail to recieve data return status 400
    if (!id || !action) {
        return res.sendStatus(400);
    }

    // Retrieve data from file
    tasks = fs.readFileSync(`data.json`, "utf-8");
    
    // Parse our recieved json data so we can work with them
    id = JSON.parse(id);
    action = JSON.parse(action);
    tasks = JSON.parse(tasks);


    // Switch determining cases by action string recieved
    switch (action) {
        // Task check input was changed
        case "check-change":
          // Loops trough our tasks and find matching id
          let newTaskDone = tasks.map((task) => {
            if (task.id === id) {
              // If done parameter was true, set it false else set it true
              if (task.done === true) {
                return { ...task, done: false };
              } else {
                return { ...task, done: true };
              }
            }
            // Return our updated array of tasks
            return task;
          });
          // Save our updated array to variable
          tasks = newTaskDone;
          break;
  
        // Task text was changed
        case "edit-text":
          // Loops trough our tasks and find matching id
          let taskTextEdit = tasks.map((task) => {
            if (task.id === id) {
            // On match, substitiue text with new one
            newText = String(newText);
            task = { ...task, text: newText };
            }
            // Return our updated array of tasks
            return task;
          });
          // Save our updated array to variable
          tasks = taskTextEdit;
          break;
  
        // Task was removed
        case "delete":
          // Using filter on our tasks array
          let taskDeleted = tasks.filter((task) => {
            // Return everything which do not match our id
            return task.id !== id;
          });
          // Save our updated array to variable
          tasks = taskDeleted;
          break;
  
          // On any other case means bad request so we send back status code 400
          default:
            res.sendStatus(400);
          break;
    }

    // Create Json format from our task array
    tasks = JSON.stringify(tasks);

    // Rewrite old data with new one
    fs.writeFileSync(`data.json`, tasks);

    // Send back OK status
    res.sendStatus(200);

})


// Upon recieving post request on /task/add
app.post("/add", async (req, res) => {
    // Recieve and save data to variable
    let text = req.body.text,
        tasks,
        setID;

    // If we fail to recieve data return status 400
    if (!text) {
        return res.sendStatus(400);
    }

    // Retrieve data from file
    tasks = await fsp.readFile(`data.json`, "utf-8");
    
    // Parse our recieved json data so we can work with them
    text = JSON.parse(text);
    
    // If we did not retrieved any data from file, set ID to 1
    if (!tasks.length || tasks === "[]"){
        setID = 1;
    }
    // Else parse our json data for future work. Also find highest id number and increment it
    else {
        tasks = JSON.parse(tasks);
        setID = Math.max(...tasks.map((t) => t.id)) + 1;
    }

    // Create new object and fill it with data
    let taskData = {
        id: setID,
        text: text,
        done: false,
        };

    // Push it to array
    taskData = [taskData]

    // Again if we do not have any data from file, tasks will contain just our new task from post request
    if (!tasks.length || tasks === "[]"){
        tasks = taskData;
    }
    // Else we will megre both arrays to one
    else {
        tasks = (tasks.concat(taskData));
    }

    // Create Json format from our task array
    tasks = JSON.stringify(tasks);

    // Rewrite old data with new one
    await fsp.writeFile(`data.json`, tasks);

    // Send back "Created" status
    res.sendStatus(201);
})
//_______________________________________________

/**
 *  HTML section
 */
 app.get("/", (req, res) => res.type('html').send(html));

 const html = `
 <!DOCTYPE html>
 <html>
   <head>
     <title>Simpletask API</title>
     <style>
        h1 {
          text-align: center;
        }
     </style>
   </head>
   <body>
     <section>
       <h1>Welcome to Simple task manager REST API</h1>
     </section>
   </body>
 </html>
 `
 //_______________________________________________

const port = process.env.PORT || 3500;
// Listen on 3500 server port, send console log on successful start
server.listen(port, () => console.log("API Server is running..."));
