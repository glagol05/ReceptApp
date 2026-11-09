const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const Database = require("better-sqlite3");

const db = new Database("./database/recipes.db");

db.prepare(`
    CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        category TEXT,
        user_id INTEGER
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
`).run();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "Du måste vara inloggad."
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return res.status(403).json({
                error: "Ogiltig eller utgången token."
            });
        }

        req.user = user;
        next();
    });
}

app.get("/", (req, res) => {
    res.json({ message: "Recept API fungerar!" });
});

app.get("/api/recipes", (req, res) => {
    try {
        const recipes = db.prepare("SELECT * FROM recipes").all();
        res.json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Kunde inte hämta recept." });
    }
});

app.get("/api/recipes/:id", (req, res) => {
    try {
        const recipe = db.prepare(
            "SELECT * FROM recipes WHERE id = ?"
        ).get(req.params.id);

        if (!recipe) {
            return res.status(404).json({
                error: "Receptet hittades inte."
            });
        }

        res.json(recipe);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Kunde inte hämta receptet."
        });
    }
});

app.post("/api/recipes", authenticateToken, (req, res) => {
    try {
        const { title, description, ingredients, instructions, category } = req.body;

        if (!title || !ingredients || !instructions) {
            return res.status(400).json({
                error: "Titel, ingredienser och instruktioner krävs."
            });
        }

        const result = db.prepare(`
            INSERT INTO recipes (title, description, ingredients, instructions, category, user_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            title,
            description,
            ingredients,
            instructions,
            category,
            req.user.id
        );

        res.status(201).json({
            message: "Receptet skapades!",
            id: result.lastInsertRowid
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Kunde inte skapa receptet." });
    }
});

app.patch("/api/recipes/:id", authenticateToken, (req, res) => {
    try {
        const { title, description, ingredients, instructions, category } = req.body;
        const id = req.params.id;

        const result = db.prepare(`
            UPDATE recipes
            SET
                title = COALESCE(?, title),
                description = COALESCE(?, description),
                ingredients = COALESCE(?, ingredients),
                instructions = COALESCE(?, instructions),
                category = COALESCE(?, category)
            WHERE id = ? AND user_id = ?
        `).run(
            title,
            description,
            ingredients,
            instructions,
            category,
            id,
            req.user.id
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: "Receptet hittades inte." });
        }

        res.json({ message: "Receptet uppdaterades!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Kunde inte uppdatera receptet." });
    }
});

app.delete("/api/recipes/:id", authenticateToken, (req, res) => {
    try {
        const id = req.params.id;

        const result = db.prepare(
            "DELETE FROM recipes WHERE id = ? AND user_id = ?"
        ).run(id, req.user.id);

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Receptet hittades inte."
            });
        }

        res.json({ message: "Receptet togs bort!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Kunde inte ta bort receptet."
        });
    }
});

app.post("/api/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "E-post och lösenord krävs."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                error: "Lösenordet måste vara minst 8 tecken."
            });
        }

        const existingUser = db.prepare(
            "SELECT id FROM users WHERE email = ?"
        ).get(email.toLowerCase());

        if (existingUser) {
            return res.status(409).json({
                error: "E-postadressen är redan registrerad."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.prepare(`
            INSERT INTO users (email, password)
            VALUES (?, ?)
        `).run(email.toLowerCase(), hashedPassword);

        res.status(201).json({
            message: "Användaren registrerades!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Kunde inte registrera användaren."
        });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "E-post och lösenord krävs."
            });
        }

        const user = db.prepare(
            "SELECT * FROM users WHERE email = ?"
        ).get(email.toLowerCase());

        if (!user) {
            return res.status(401).json({
                error: "Fel e-postadress eller lösenord."
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                error: "Fel e-postadress eller lösenord."
            });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Inloggningen lyckades!",
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Kunde inte logga in."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servern körs på port ${PORT}`);
});