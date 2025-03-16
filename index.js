import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "your_user_here",
  host: "your_host_here",
  database: "your_db_name_here",
  password: "your_password_here",
  port: 5432
});

db.connect();

let items;
const today = new Date();
const formattedDate = today.toLocaleDateString();

app.get("/", async(req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;

    res.render("index.ejs", {
      listTitle: formattedDate,
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  }
  catch(err) {
    console.log(err);
  }
});

app.post("/edit", async(req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [item, id]);
    res.redirect("/");
  }
  catch(err) {
    console.log(err);
  }
});

app.post("/delete", async(req, res) => {
  const deletedId = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [deletedId]);
    res.redirect("/");
  }
  catch(err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
