import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Alcharaxx450@",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', async (req, res) => {
  let result = await db.query('SELECT country_code FROM visited_countries')
  result = result.rows
 
  let country_codes = []
  result.forEach(code => {
    country_codes.push(code.country_code)
  });
 
  res.render('index.ejs', {countries: country_codes, total: country_codes.length})
})

app.post('/add', async(req, res) => {
  let input = req.body['country']
  
  let result = await db.query("SELECT country_name FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'", [input.toLowerCase()])
  result = result.rows

  
  result.forEach(async row => {
    // if(row.country_name.toLowerCase() == input.trim().toLowerCase()){
      let result = await db.query('SELECT * FROM visited_countries WHERE country_code = $1', [row.country_code])

      if(result.rows.length >= 1){
        console.log('Already exist')
      }else{
        await db.query('INSERT INTO visited_countries (country_code) VALUES ($1)', [row.country_code])
      }
      
    // }
  
  })
  res.redirect('/')
})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
