import express from 'express';
import db from '../db_connection.js';
import bodyParser from 'body-parser';

const router = express.Router();
router.use(bodyParser.json());
//get 
router.get('/',async (req, res) => {
try {
    const [rows]=await db.query('select * from authors')
    if(rows.length>0){
        res.status(200).json(rows);
    }
} 
catch (error) { 
    console.error('Error:', error);
    res.status(500).send('Internal Server Error', error);
  }
});


//post 
router.post('/', async (req, res) => {
try{

    const {name,country,birth_year} = req.body;
    const [result] = await db.query('insert into authors (name,country,birth_year) VALUES (?, ?, ?)', [name,country,birth_year]);
    res.json({ id: result.insertId });
}catch(error){
    console.error('Error:', error);
    res.status(500).send('Internal Server Error', error);
  }

});

//put
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, country, birth_year } = req.body;
    try {
        const [result] = await db.query('UPDATE authors SET name=?, country=?, birth_year=? WHERE id=?', [name, country, birth_year, id]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Author updated successfully' });
        } else {
            res.status(404).json({ message: 'Author not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error', error);
    }
})




//delete
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM authors WHERE id=?', [id]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Author deleted successfully' });
        } else {
            res.status(404).json({ message: 'Author not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error', error);
    }
})


export default router;