const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')

const mysql = require('mysql2/promise')

const DB_USERNAME = 'root'
const DB_PASSWORD = ''

let conn

mysql.createConnection({
    user : DB_USERNAME,
    password : DB_PASSWORD
})
.then((connection) => {
    conn = connection
    return connection.query('CREATE DATABASE IF NOT EXISTS tw_exam')
})
.then(() => {
    return conn.end()
})
.catch((err) => {
    console.warn(err.stack)
})

const sequelize = new Sequelize('tw_exam', DB_USERNAME, DB_PASSWORD,{
    dialect : 'mysql',
    logging: false
})

let Ship = sequelize.define('student', {
    name : Sequelize.STRING,
    portOfSail : Sequelize.STRING,
    displacement : Sequelize.INTEGER
},{
    timestamps : false
})

const app = express()
app.use(bodyParser.json())

let divideResponse = (arr, size) => {
    var myArray = [];
    for(var i = 0; i < arr.length; i += size) {
      myArray.push(arr.slice(i, i+size));
    }
    return myArray;
  }

app.get('/create', async (req, res) => {
    try{
        await sequelize.sync({force : true})
        for (let i = 0; i < 10; i++){
            let ship = new Ship({
                name : `name${i}`,
                portOfSail : `port ${i}`,
                displacement : 3000 + 10 * i
            })
            await ship.save()
        }
        res.status(201).json({message : 'created'})
    }
    catch(err){
        console.warn(err.stack)
        res.status(500).json({message : 'server error'})
    }
})

app.get('/ships', async (req, res) => {
    let pageSize = req.query.pageSize
    let page = req.query.pageNo

    sequelize.query("SELECT * FROM `students`", { type: sequelize.QueryTypes.SELECT})
        .then(ships => {
            let response = ships
            // Daca nu e pagina si daca nu e nici size
            if((!page && !pageSize)){
                res.json(response)
            }
            // Daca e pagina dar nu e size
            if(page !== undefined && pageSize === undefined){
                let responseShips
                let Page = parseInt(page)
                responseShips = divideResponse(ships, 5)
                if(responseShips[Page] === undefined){
                    res.json([])
                }else{
                    res.send(responseShips[Page]);
                }
                
            }
            // Daca e si pagina si sieze
            if(page !== undefined && pageSize !== undefined){
                let responseShips
                let Page = parseInt(page)
                let PageSize = parseInt(pageSize)

                if(isNaN(Page) && isNaN(PageSize)){
                    res.json(response)
                }else{
                    responseShips = divideResponse(ships, PageSize)
                    res.json(responseShips[Page]);
                }
                

            }
            // Daca pagina sau size sunt invalide
        })
})

app.post('/ships', async (req, res) => {
	try{
		let ship = new Ship(req.body)
		await ship.save()
		res.status(201).json({message : 'created'})
	}
	catch(err){
		res.status(500).json({message : 'server error'})		
	}
})

module.exports = app