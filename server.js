const express = require("express");
const app = express();  // these first two lines are the standard way to set up express
const PORT = 5000;
const MongoClient = require("mongodb").MongoClient; // sets up how we talk to MongoDB
require("dotenv").config(); // preps the environmental variables


let db,
  dbConnectionStr = process.env.DB_STRING, // accesses the environmental variable
  dbName = "rap";

// set up the connection to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

app.set("view engine", "ejs");  // lets Express know that we're using ejs as a templating engine
app.use(express.static("public")); // thanks to this line, we don't have to write custom routes to serve static files (Express will serve them automatically)
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // these two lines allow us to access data on the request body that is formatted as a JSON or URL-encoded (e.g., form data)


// Here is where we start telling the server what to listen for (the method), where to listen (the endpoint), and what to do when a request comes through (the function)

app.get("/", (request, response) => {  // Within this function we are defining what happens when the server hears this request
  db.collection("rappers").find().toArray()
    // What this is saying is that when a GET request is made to the root directory ("/"), the server will go to the database, access the collection named "rappers," find all of the documents, convert them into an array, and then return that array
    .then((data) => {  // "data" here refers to the array that was just returned, i.e. the array of documents from the "rappers" collection
      response.render("index.ejs", { info: data });
      // The server then prepares the response to the client.  It's going to send the index.ejs file, rendered into HTML.  But in order to render the file, it needs to send EJS an object containing the information that it can use to "fill in the blanks."  
      // In this case, the server is sending EJS an object with the property "info" and the value "data" -- i.e., the array of rappers taken from the database
      // This is why when you look in index.ejs you'll see references to "info"
    })
    .catch((error) => console.error(error));
});

app.post("/addRapper", (request, response) => {
  // The server is set up to listen for POST requests made to the "/addRapper" endpoint.
  db.collection("rappers")
    // When a request comes in, the server once again accesses the collection named "rappers" on the database
    .insertOne({
      stageName: request.body.stageName,
      birthName: request.body.birthName,
      likes: 0,
    })
    // Instead of finding data, it uses the insertOne() method and information taken from the body of the request to make a new entry
    .then((result) => {
      console.log("Rapper added");  // The server logs this message
      response.redirect("/"); // This returns the browser to the root index; in effect it forces a page refresh (which, as we now know, means a "GET" request)
    })
    .catch((error) => console.error(error));
});

app.put("/addLike", (request, response) => {
  db.collection("rappers")
    .updateOne(
      { stageName: request.body.stageNameS },
      { $inc: { likes: 1 } }
    )
    // Using the updateOne() method, a document is located that matches the given key:value pair, and the value of its "likes" property is increased by one 
    .then((result) => {
      console.log(result);
      response.json("Likes updated");  // response.json() in Express accepts an object or array (or, in this case, a string), converts it to a JSON, and sends it to the client.  Check main.js to see what the client does with it.
    })
    .catch((error) => console.error(error));
});

app.delete("/deleteRapper", (request, response) => {
  db.collection("rappers")
    .deleteOne({ stageName: request.body.stageNameS })
    // The first document in the collection that has a matching key:value pair will be deleted.
    .then((result) => {
      console.log("Rapper deleted");
      response.json("Rapper deleted");
    })
    .catch((error) => console.error(error));
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
