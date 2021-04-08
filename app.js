const express = require('express')
const app = express()
const port = 3000

app.use('/', function (req, res, next){
  console.log(req.ip)
  next();
  })

app.get('/', (req, res) => {
  res.send('helow wold')
})

app.get('/user', (req, res) => {
    res.send('get user')
  })


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})