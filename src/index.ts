import express, { Application } from "express";
import cors from "cors"
import { readFile } from "fs/promises"
const app: Application = express();

//dozvoljava se svima da cackaju
//ovo je samo tu da "smirimo" browser, jer default ponasanje ne dozvoljava cross origin
//osim ako nije eksplicitno receno pomocu hederi
app.use(cors()) //izgleda da resava sve zivo, ledilo mozga...

type Task = {
    Id: number
    Description: string
    Completed: boolean
}

let tasks: Task[] = []
let ids = 0
//get na localhost:3000/api/task
app.get("/api/task", (req, resp) => {
    resp.send(tasks)
})

/*
Vazno je imati na klienta gde se salje json body (post/put)
headers: {
            'Content-Type': 'application/json'
        },
u fetch inace nece da radi...
*/
app.use(express.json()); // da bi imao req.body. bog da cuva...
app.post("/api/task", (req, resp) => {
    console.log("POST: ", req.body)

    const task = {
        Id: ids++,
        Description: req.body.Description,
        Completed: false
    }
    tasks.push(task)

    //uvek nesto mora da se posalje
    resp.send(task)
})

/*
OVO JE ZA SLUCAJ DA SE RADI CORS ZA SVAKU RUTU

app.options('/products/:id', cors()) // enable pre-flight request for DELETE request
app.del('/products/:id', cors(), function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})
*/
//primer: /api/task/0 i onda 0 se izvlaci preko id, req.params.id
app.delete("/api/task/:id", (req, resp) => {

    let taskId = parseInt(req.params.id)
    console.log("delete:", taskId)
    let newTasks: Task[] = []
    let j = 0
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (task.Id == taskId) {
            continue
        }

        newTasks[j++] = task
    }
    tasks = newTasks

    resp.send({ Status: "Svaka cast, bravo ti ga bravo" })
})

//TODO handle any somehow
function deleteAll(request: any, resposne: any) {
    console.log("delete all...")
    tasks = []
    resposne.send({})
}

app.delete("/api/deleteAllTask", deleteAll)

app.put("/api/undoTask/:id", function (req, resp) {
    let taskId = parseInt(req.params.id)
    console.log("undoTask:", taskId)

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (task.Id == taskId) {
            task.Completed = false
            break
        }
    }

    //mora neki resposne
    resp.send({})
})

app.put("/api/doTask/:id", function (req, resp) {
    let taskId = parseInt(req.params.id)
    console.log("doTask:", taskId)

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (task.Id == taskId) {
            task.Completed = true
            break
        }
    }

    resp.send({})
})

app.put("/api/task/:id", function (req, resp) {
    let taskId = parseInt(req.params.id)
    console.log("update:", taskId)

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (task.Id == taskId) {
            task.Description = req.body.Description
            break
        }
    }

    resp.send({})
})


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