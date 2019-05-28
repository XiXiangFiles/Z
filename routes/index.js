var express = require('express')
var router = express.Router()
let protibility = 90
const fs = require('fs')
let tvsize = []
let ipsize = new Map()
let count = 0
const allNodes = []
const tv = new Map()
/* GET home page. */
router.get('/zwot', function (req, res, next) {
  function getRandomInt (max, min) {
    return Math.floor(Math.random() * (max - min)) + min
  }
  if (count++ < protibility) {
    const config = JSON.parse(fs.readFileSync(`${__dirname}/files/zwot/tv/tv.json`, 'utf8'))
    let size = getRandomInt(50, 20)
    tvsize.push(size)
    ipsize.set(req.connection.remoteAddress, size)
    config.WoTs._tv.values.size = size
    tv.set(req.headers.host.split(':')[0], size)
    res.write(JSON.stringify(config))
    res.end()
  } else {
    if (count % 4 === 0) {
      res.write(fs.readFileSync(`${__dirname}/files/zwot/air/air.json`, 'utf8'))
      res.end()
    }
    if (count % 4 === 1) {
      res.write(fs.readFileSync(`${__dirname}/files/zwot/light/light.json`, 'utf8'))
      res.end()
    }
    if (count % 4 === 2) {
      res.write(fs.readFileSync(`${__dirname}/files/zwot/temperature/temperature.json`, 'utf8'))
      res.end()
    }
    if (count % 4 === 3) {
      res.write(fs.readFileSync(`${__dirname}/files/zwot/printer/printer.json`, 'utf8'))
      res.end()
    }
  }
})
router.get('/alltv', function (req, res, next) {
  res.write(JSON.stringify(tvsize))
  res.end()
})
router.post('/precision', function (req, res, next) {
  let numerator = 0
  const data = req.body
  console.log(tv)
  for (let i = 0; i < data.ipv4.length; i++) {
    if (tv.get(data.ipv4[i]) === data.size) {
      numerator++
    }
  }
  let ans = numerator / data.ipv4.length
  res.write(JSON.stringify(ans.toString()))
  res.end()
})
// curl -d '{"size":49,"ipv4":["127.0.0.1"]}' -H "Content-Type: application/json" -X POST http://localhost:3000/precision
// curl -d '{"size":48,"ipv4":["192.168.4.219"]}' -H "Content-Type: application/json" -X POST http://localhost:3000/precision
router.post('/recall', function (req, res, next) {
  let numerator = 0
  let denominator = 0
  const data = req.body
  console.log(tv)
  for (let i = 0; i < data.ipv4.length; i++) {
    if (tv.get(data.ipv4[i]) === data.size) {
      numerator++
    }
  }
  let iterator1 = tv.entries()
  for (let j = 0; j < tv.size; j++) {
    if (iterator1.next().value[1] === data.size) {
      denominator++
    }
  }
  let ans = numerator / denominator
  res.write(JSON.stringify(ans.toString()))
  res.end()
})
router.get('/checkall', function (req, res, next) {
  console.log(allNodes)
  res.end()
})

module.exports = router
