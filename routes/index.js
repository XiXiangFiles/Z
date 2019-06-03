var express = require('express')
var router = express.Router()
let protibility = 10
const fs = require('fs')
let tvsize = []
let ipsize = new Map()
let count = 0
const allNodes = []
const tv = new Map()
const tv_stype = new Map()
/* GET home page. */
router.get('/zwot', function (req, res, next) {
  function getRandomInt (max, min) {
    return Math.floor(Math.random() * (max - min)) + min
  }
  let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0].split(':')[3]
  allNodes.push(ip)
  if (count++ < protibility) {
    function generateStype (protocols){
      return `_tv._sub._${protocols[0]}._${protocols[1]}.local`
    }
    const config = JSON.parse(fs.readFileSync(`${__dirname}/files/zwot/tv/tv.json`, 'utf8'))
    let size = getRandomInt(50, 20)
    let numProtocols = getRandomInt(0, 3)
    let protocols =[["http", "tcp"],["websocket", "tcp"],["coap", "udp"]] 
    tvsize.push(size)
    ipsize.set(ip, size)
    if(getRandomInt(100,1) > 15){
      config.WoTs._tv.values.size = size
    } else {
      config.WoTs._tv.values.size = `${size}`
    }
    config.WoTs['_tv'].protocols = protocols[numProtocols]
    tv_stype.set(ip, generateStype(protocols[numProtocols]))
    tv.set(ip, size)
    res.write(JSON.stringify(config))
    res.end()
  } else {
    if (count % 4 === 0) {
      if( getRandomInt (3, 1) === 2) {
	let size = getRandomInt(50, 20)
        const config = JSON.parse(fs.readFileSync(`${__dirname}/files/zwot/tv/tv.json`, 'utf8'))   
        config.WoTs._tv.values.size = size
	config.WoTs._tv.status = 'none'
	res.write(JSON.stringify(config))
        res.end()
      } else {
        res.write(fs.readFileSync(`${__dirname}/files/zwot/air/air.json`, 'utf8'))
        res.end()
      }
    }
    if (count % 4 === 1) {
      if( getRandomInt (3, 1) === 2) {
	let size = getRandomInt(50, 20)
        const config = JSON.parse(fs.readFileSync(`${__dirname}/files/zwot/tv/tv.json`, 'utf8'))   
        config.WoTs._tv.values.size = size
	config.WoTs._tv.status = 'none'
	res.write(JSON.stringify(config))
        res.end()
      } else { 
        res.write(fs.readFileSync(`${__dirname}/files/zwot/light/light.json`, 'utf8'))
        res.end()
      }
    }
    if (count % 4 === 2) {
      if( getRandomInt (3, 1) === 2) {
	let size = getRandomInt(50, 20)
        const config = JSON.parse(fs.readFileSync(`${__dirname}/files/zwot/tv/tv.json`, 'utf8'))   
        config.WoTs._tv.values.size = size
	config.WoTs._tv.status = 'none'
	res.write(JSON.stringify(config))
        res.end()
      } else { 
        res.write(fs.readFileSync(`${__dirname}/files/zwot/temperature/temperature.json`, 'utf8'))
        res.end()
      }

    }
    if (count % 4 === 3) {
      if( getRandomInt (3, 1) === 2) {
	let size = getRandomInt(50, 20)
        const config = JSON.parse(fs.readFileSync(`${__dirname}/files/zwot/tv/tv.json`, 'utf8'))   
        config.WoTs._tv.values.size = size
	config.WoTs._tv.status = 'none'
	res.write(JSON.stringify(config))
        res.end()
      } else { 
        res.write(fs.readFileSync(`${__dirname}/files/zwot/printer/printer.json`, 'utf8'))
        res.end()
      }
    }
  }
})
router.get('/alltv', function (req, res, next) {
  res.write(JSON.stringify(tvsize))
  res.end()
})
router.post('/precision', function (req, res, next) {
  let numerator = 0
  let data = req.body
  data.size = parseInt(data.size)
  data.ipv4 = JSON.parse(data.ipv4)
  for (let i = 0; i < data.ipv4.length; i++) {
    if (tv.get(data.ipv4[i]) == data.size) {
      numerator++
    }
  }

  let ans = numerator / data.ipv4.length

  if (ans) {
    res.write(ans.toString())
  } else if (data.ipv4.length > 0 && numerator === 0 ){
    ans = 0
    res.write(ans.toString())
  } else {
    ans = -1
    res.write(ans.toString())
  }

  res.end()
})
router.post('/precisionStype', function (req, res, next) {
  let numerator = 0
  let data = req.body
  data.ipv4 = JSON.parse(data.ipv4)
  for (let i = 0; i < data.ipv4.length; i++) {
    if (tv_stype.get(data.ipv4[i])) {
      numerator++
    }
  }

  let ans = numerator / data.ipv4.length

  if (ans) {
    res.write(ans.toString())
  } else if (data.ipv4.length > 0 && numerator === 0 ){
    ans = 0
    res.write(ans.toString())
  } else {
    ans = -1
    res.write(ans.toString())
  }

  res.end()
})

router.post('/recallStype', function (req, res, next) {
  let numerator = 0
  let denominator = 0
  let data = req.body
  data.tv_stype = data.tv_stype
  data.ipv4 = JSON.parse(data.ipv4)
  for (let i = 0; i < data.ipv4.length; i++) {
    if (tv.get(data.ipv4[i])) {
      numerator++
    }
  }
  let iterator1 = tv.entries()
  for (let j = 0; j < tv_stype.size; j++) {
    if (iterator1.next().value[0]) {
      denominator++
    }
  }
  let ans = numerator / denominator
  if (ans){
    res.write(ans.toString())
  }else if (data.ipv4.length > 0 && denominator === 0) {
    ans = 0
    res.write(ans.toString())
  } else if (data.ipv4.length === 0 && denominator === 0) {
    ans = 1
    res.write(ans.toString())
  } else {
    ans = -1
    res.write(ans.toString())
  }
  res.end()
})
router.post('/recall', function (req, res, next) {
  let numerator = 0
  let denominator = 0
  let data = req.body
  data.size = parseInt(data.size)
  data.tv_stype = data.tv_stype
  data.ipv4 = JSON.parse(data.ipv4)
  for (let i = 0; i < data.ipv4.length; i++) {
    if (tv.get(data.ipv4[i]) == data.size) {
      numerator++
    }
  }
  let iterator1 = tv.entries()
  for (let j = 0; j < tv_stype.size; j++) {
    mapsize = iterator1.next().value[1]
    console.log(`data.size = ${data.size}, map.size = ${mapsize}`)
    if (data.size == mapsize) {
      denominator++
    }
  }
  let ans = numerator / denominator
  console.log(`${numerator} / ${denominator}`)
  if (ans){
    res.write(ans.toString())
  }else if (data.ipv4.length > 0 && denominator === 0) {
    ans = 0
    res.write(ans.toString())
  } else if (data.ipv4.length === 0 && denominator === 0) {
    ans = 1
    res.write(ans.toString())
  } else {
    ans = -1
    res.write(ans.toString())
  }
  res.end()
})
router.get('/checkall', function (req, res, next) {
  console.log(allNodes)
  console.log(allNodes.length)
  console.log(tv)
  console.log(tv.size)
  console.log(tv_stype) 
  console.log(tv_stype.size)
  res.end()
})

module.exports = router
