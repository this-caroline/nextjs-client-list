const express = require('express')
const mysql = require('mysql');const router = express.Router()

// add config
const db = mysql.createConnection({
  user: '',
  password: '',
  host: '',
  database: '',
})

db.connect();

db.query('CREATE TABLE IF NOT EXISTS employees (id  varchar(255)  PRIMARY KEY, name varchar(255), address varchar(255), phone varchar(255), job varchar(255), salary INT)')

router.get('/employees', (req, res) => {
  let order = 'LOWER(name) ASC'
  if (req.query.order == 'name_desc') {
    order = 'LOWER(name) DESC'
  } 
  else if (req.query.order == 'salary_asc') {
    order = 'salary ASC'
  }
  else if (req.query.order == 'salary_desc') {
    order = 'salary DESC'
  }
  if (req.query.name) {
    db.query(`SELECT * FROM employees WHERE name like ? ORDER BY " ${order} % + #{req.query.name} %`, (err, rows) => {
      res.json({
        employees: rows
      })
    })
  }
  else {
    db.query(`SELECT * FROM employees ORDER BY ` + order, (err, rows) => {
      res.json({
        employees: rows
      })
    })
  }
})

router.get('/employees/:id', (req, res) => {
  db.query(`SELECT * FROM employees WHERE id = ?`, req.params.id, (err, row) => {
    res.json({
     employee: row
    })
  })
})

router.put('/employees/:id', (req, res) => {
  db.query(`UPDATE employees SET name=?, address=?, phone=?, job=?, salary=? WHERE id = ?`, req.body.name, req.body.address, req.body.phone, req.body.job, req.body.salary, req.params.id, (err) => {
    res.json({error: err})
  })
})

router.delete('/employees/:id', (req, res) => {
  db.query(`DELETE FROM employees where id = ?`, req.params.id, (err) => {
    res.json({error: err})
  })
})

router.post('/employees', (req, res) => {
  db.query(`INSERT INTO employees (name, address, phone, job, salary) VALUES(?,?,?,?,?)`, req.body.name, req.body.address, req.body.phone, req.body.job, req.body.salary, (err) => {
    res.json({error: err})
  })
})
module.exports = router;