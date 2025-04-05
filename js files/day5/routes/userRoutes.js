import express from "express";
import db from "../db_connection.js";
import bodyParser from "body-parser";

const router = express.Router();

//get
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("select * from users");
    if (rows.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//post

router.post("/", async (req, res) => {
  const { name, email, age, created_at } = req.body;
  const [rows] = await db.query(
    "insert into users (name,email,age,created_at) VALUES (?,?,?,?)",
    [name, email, age, created_at]
  );

  if (rows.affectedRows > 0) {
    res.status(201).json({ message: "user added successfully" });
  } else {
    res.status(500).json({ message: "error adding user" });
  }
});

//put
router.put("/:id", async (req, res) => {
  try {
    const { name, email, age, created_at } = req.body;
    const { id } = req.params;
    const [rows] = await db.query(
      "update users set name=?,email=?,age=?,created_at=? where user_id=?",
      [name, email, age, created_at, id]
    );
    if (rows.affectedRows > 0) {
      res.status(200).json({ message: "User info updated successfully" });
    } else {
      res.status(404).json({ message: "No user found with such id" });
    }
  } catch (Err) {
    console.log(Err);
    res.status(500).json({ error: "Server Error" });
  }
});

//delete
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("delete from users where user_id=?", [id]);

    if (rows.affectedRows === 0) {
      return res.status(404).json({ error: "User Not found with such id" });
    }
    res.status(200).json({ message: `User Deleted with id ${id}` });
  } catch (Err) {
    console.log(Err);
    res
      .status(500)
      .json({ error: "Internal Server Error, please check console" });
  }
});

export default router;
