import express from "express"
import Database from "bun:sqlite"
import cors from "cors"
import moment from "moment"

const db = new Database("./database.sqlite", {
    create: true,
})

db.exec(
    "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, text TEXT, completed INTEGER, created_at DATETIME)",
)

const app = express()

app.use(express.json())
app.use(cors())

app.get("/todos", (req, res) => {
    const todos = db.query("SELECT * FROM todos").all()

    res.json({
        todos: todos,
    })
})

app.post("/todos", (req, res) => {
    const { id, text, completed } = req.body

    if (!text || completed === undefined) {
        res.status(422).json({
            error: "Validation error.",
        })

        return
    }

    if (!id) {
        db
            .prepare(
                "INSERT INTO todos (text, completed, created_at) VALUES (?, ?, ?)",
                [text, completed, moment().format("YYYY-MM-DD HH:mm:ss")],
            )
            .get() as any

        res.json({
            message: "Todo created.",
        })

        return
    }

    db.prepare("UPDATE todos SET text = ?, completed = ? WHERE id = ?").run(
        text,
        completed,
        id,
    )

    res.json({
        message: "Todo updated.",
    })
})

app.delete("/todos/:id", (req, res) => {
    const { id } = req.params

    db.prepare("DELETE FROM todos WHERE id = ? RETURNING *").get(id) as any

    res.json({
        message: "Todo deleted.",
    })
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})
