import express, { json } from "express";
import db from "../db_connection.js";

const router = express.Router();

//get
router.get("/", async (req, res) => {
  const [rows] = await db.query("select * from books");
  if (rows.length > 0) {
    res.status(200).json(rows);
  } else {
    res.status(404).send("No books found");
  }
});

//post
router.post("/", async (req, res) => {
  try {
    const { title, author_id, genre_id, published_year, price } = req.body;
    const [rows] = await db.query(
      "insert into books(title,author_id,genre_id,published_year,price) values(?,?,?,?,?)",
      [title, author_id, genre_id, published_year, price]
    );
    if (rows.affectedRows > 0) {
      res.status(201).send("Book added successfully");
    } else {
      res.status(500).send("Error adding book");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//put
router.put("/:id", async (req, res) => {
  try {
    const { title, author_id, genre_id, published_year, price } = req.body;
    const [rows] = await db.query(
      "update books set title=?,author_id=?,genre_id=?,published_year=?,price=? where book_id=?",
      [title, author_id, genre_id, published_year, price, req.params.id]
    );
    if (rows.affectedRows > 0) {
      res.status(200).send("Book updated successfully");
    } else {
      res.status(500).send("Error updating book");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//delete
router.delete("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("delete from books where book_id=?", [
      req.params.id,
    ]);
    if (rows.affectedRows > 0) {
      res.status(200).send("Book deleted successfully");
    } else {
      res.status(500).send("Error deleting book");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//custom query  ################################

// list all books with author and genre names
router.get("/viewbookdetails", async (req, res) => {

    try{

        const [rows] =
        await db.query(`select book_id,title,published_year,price,b.author_id,a.name,g.genre_id,g.name 
            from books b 
            join authors a on b.author_id=a.author_id
            join genres g on b.genre_id=g.genre_id;
            
            `);
            
            if(rows.length>0){
                res.status(200).json({rows})
            }else{
                res.status(400).send("No Such data")
            }
        }

        catch(Err){
            console.log(Err);
            res.status(500).send("Server Error, Please check console");
        }
});

export default router;
