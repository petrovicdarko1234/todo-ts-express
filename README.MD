1. Do everything from https://github.com/sloba-byte/zmijica

2. Install express and cors (with typescript types)

```
npm i express 
```
```
npm i --save-dev @types/express 
```

```
npm i cors
```

```
npm i --save-dev @types/cors
```
3. Init stuff
```js
import express, { Application } from "express";
import cors from "cors"

const app: Application = express();
```

4. Cors

```js
app.use(cors())
```
# CRUD (Create Read Update Delete)

5. GET (Read)

```js
app.get("/api/task", (req, resp) => {
    resp.send(tasks)
})
```


6. POST (Create)

```js
//express.json() enables req.body
//without this req.body is undefined
app.use(express.json()); 

//req => request from client
//resp => response from server

//So client & server play a request / response game
app.post("/api/task", (req, resp) => {
    console.log("POST: ", req.body)

    //...work

    //always have to send something
    resp.send({})
})
```

7. PUT (Update)

```js
app.put("/api/task/:id", (req, resp) => {
    console.log("PUT: ", req.body)
    console.log("ID: ", parseInt(req.params.id))
    //...work

    //always have to send something
    resp.send({})
})
```

8. DELETE (Delete)

```js
app.delete("/api/task/:id", (req, resp) => {
    let taskId = parseInt(req.params.id)
    console.log("delete:", taskId)
    
    resp.send({ })
})
```


9. How to execute everything:

```js
const PORT = 3000

app
    .listen(PORT, function () {
        console.log(`Server is running on port ${PORT}.`);
    })
    .on("error", (err: any) => {
        if (err.code === "EADDRINUSE") {
            console.log("Error: address already in use");
        } else {
            console.log(err);
        }
    });
```

10. BONUS working with files

```js
import { readFile, writeFile } from "fs/promises"

async function readFromPath(path: string) {
    const content = await readFile(path, "utf-8")

    //do something with content...

    //to parse json use
    //Converts a JavaScript Object Notation (JSON) string into an object.
    tasks = JSON.parse(content) as Task[]
}

async function writeToPath(path: string, content: string) {
    await writeFile(path, content, "utf-8")
}

//example usage

let tasks []Task = //...

writeToPath("tasks.json", JSON.stringify(tasks))

readFromPath("tasks.json")
```

11. How to serve (same as github pages) your HTML/JS/CSS
```js
//serviraju se staticki fajlovi iz ovaj folder
//kada odem na localhost:4000 on mi izbaci index.html
//a mogu da odem i na localhost:4000/index.html
//ako kazem window.location.href = "tasks.html" => localhost:4000/tasks.html
//Server radi 2 posla, jedan je kao github pages servira staticki fajlovi (html + js + css + sta god jos)
//A drugi posao je da ima http request response

app.use(express.static("../Tasks/")) //GITHUB PAGES
```


12.Cookie funnctions
```js
function setCookie(name: string, val: string) {
    const date = new Date();
    const value = val;

    // Set it expire in 7 days
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));

    // Set it name = val in string
    document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";

    console.log("document.cookie", document.cookie)
}

function getCookie(name: string): string {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");

    if (parts.length == 2) {
        return parts[1];
    }

    return ""
}

function deleteCookie(name: string) {
    const date = new Date();

    // Set it expire in -1 days
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));

    // Set it
    document.cookie = name + "=; expires=" + date.toUTCString() + "; path=/";
}
```

