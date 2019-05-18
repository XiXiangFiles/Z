var express = require('express');
var router = express.Router();
let protibility 
const fs = require('fs')
let tvsize = []
let count = 0
const allNodes = new Map()
const tv = new Map()
/* GET home page. */
router.get('/zwot', function(req, res, next) {
  function getRandomInt(max,min) {
    return Math.floor(Math.random() * (max - min)) + min
  }
  if(allNodes.has(req.query.ip)){
    allNodes.set(req.query.ip,allNodes.get(req.query.ip)+1)
  } else {
    allNodes.set(req.query.ip,1)
  }
  if (count++ < protibility){
    const config = JSON.parse(fs.readFileSync(`${__dirname}/files/zwot/tv/tv.json`,'utf8'))
    let size = getRandomInt(50,20)
    tvsize.push(size)
    config.WoTs._tv.values.size = size
    res.write(JSON.stringify(config))
    res.end()
  }else{
    if (count % 4 ===0){
      res.write(fs.readFileSync(`${__dirname}/files/zwot/air/air.json`,'utf8'))    
      res.end()
    }
    if (count % 4 ===1){
      res.write(fs.readFileSync(`${__dirname}/files/zwot/light/light.json`,'utf8'))    
      res.end()
    }
    if (count % 4 ===2){
      res.write(fs.readFileSync(`${__dirname}/files/zwot/temperature/temperature.json`,'utf8'))    
      res.end()
    }
    if (count % 4 ===3){
      res.write(fs.readFileSync(`${__dirname}/files/zwot/printer/printer.json`,'utf8'))    
      res.end()
    }
  }
});
router.get('/alltv', function(req, res, next) {
  res.write(JSON.stringify(tvsize))    
  res.end()
});
router.get('/set', function(req, res, next) {
  protibility = req.query.protibility
  res.write(JSON.stringify({"status":true,"protibility":protibility}))    
  res.end()
});
router.get('/reset', function(req, res, next) {
  tvsize = []
  res.write(JSON.stringify({"status":true,"reset":"ok","protibility":protibility}))    
  res.end()
});
router.get('/recall', function(req, res, next) {
  const ans = req.query.ans
  const requirement = req.query.requirement
  res.write(JSON.stringify(c))    
  res.end()
});
router.get('/checkall', function(req, res, next) {
  console.log(allNodes)
  // res.write(`${total}`)    
  res.end()
});


module.exports = router;
