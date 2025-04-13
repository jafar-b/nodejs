import express from "express";
import db from "../db_connection.js";

const router = express.Router();

//get
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("select * from genres");
    if (rows.length === 0) {
      return res.status(404).json({ message: "No genres found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//post
router.post("/", async (req, res) => {
  const { name, description } = req.body;
  try {
    const [result] = await db.query(
      "insert into genres (name,description) values (?,?)",
      [name, description]
    );
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    console.error("Error creating genre:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//put
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const [result] = await db.query(
      "update genres set name = ?, description = ? where genre_id = ?",
      [name, description, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Genre not found" });
    }
    res.status(200).json({ id, name });
  } catch (error) {
    console.error("Error updating genre:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//delete
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("delete from genres where genre_id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Genre not found" });
    }
    res.send("Genre deleted successfully");
  } catch (error) {
    console.error("Error deleting genre:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
