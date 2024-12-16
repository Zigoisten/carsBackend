import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
const app = express();
app.listen(5000, () => {
    console.log("A szerver a http://localhost:5000 -es porton fut")
} );
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("./db.sqlite");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS cars ( id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, brand TEXT NOT NULL, model TEXT NOT NULL, color TEXT NOT NULL, year INTEGER NOT NULL)"
  );
});

app.get(`/cars`, (req, res) => {
  db.all("SELECT * FROM cars;", (err, response) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.status(200).json(response);
  });
});

app.get(`/cars/:id`, (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM cars WHERE id = ?", [id], (err, response) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!response) {
      return res.status(404).json({ message: "404 NOT FOUND" });
    }
    res.status(200).json(response);
  });
});

app.post(`/cars`, (req, res) => {
  const {brand, model, color, year} = req.body;
  db.run(
    "INSERT INTO cars (brand, model, color, year) VALUES (?,?,?,?)",
    [brand, model, color, year],
    (err) => {
      if (err) {
        return res.status(500).json({ message: res.message });
      }
      res.status(201).json({ id, brand, model, color, year });
    }
  );
});

app.put(`/cars/:id`, (req, res) => {
  const id = req.params.id;
  const {brand, model, color, year} = req.body;
  db.get("SELECT * FROM cars WHERE id = ?", [id], (err, response) => {
    if (err) {
      return res.status(500).json({ message: res.message });
    }
    if (!response) {
      return res.status(404).json({ message: "404 NOT FOUND" });
    }
    db.run(
      "UPDATE cars SET brand = ?, model = ?, color = ?, year = ? WHERE id = ?",
      [brand, model.color, year, id],
      (err, response) => {
        if (err) {
          return res.status(500).json({ message: res.message });
        }
        res.status(204).json({ id, brand, model, color, year });
      }
    );
  });
});

app.delete(`/cars/:id`, (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM cars WHERE id = ?;", [id], (err, response) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!response) {
      return res.status(404).json({ message: "404 NOT FOUND" });
    }
    db.run("DELETE FROM cars WHERE id = ?;", [id], (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.sendStatus(204);
    });
  });
});
