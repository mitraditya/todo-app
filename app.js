const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Joi = require('joi');

const db = require('./db');
const collection = "todo";
const app = express();

const schema = Joi.object().keys({
    todo : Joi.string().required()
});

app.use(bodyParser.json());//use body-parser module and parse json data sent from client to server

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'))
});

app.get('/getTodos', (req,res)=>{
    db.getDB().collection(collection).find({}).toArray((err,documents)=>{
        if(err)
        console.log(err);
        else{
            console.log(documents);
            res.json(documents);
        }
    });
});

app.put('/:id',(req,res,next)=>{
    const todoID = req.params.id;
    const userInput = req.body;

    Joi.validate(userInput,schema,(err,result)=>{
        if(err){
            const error = new Error("Invalid Input");
            error.status = 400;
            next(error);
        }
        else{
            db.getDB().collection(collection).findOneAndUpdate({_id: db.getPrimaryKey(todoID)},{$set : {todo: userInput.todo}},{returnOriginal : false}, (err,result)=>{
                if(err){
                    const error = new Error("Failed to Update Todo");
                    error.status = 400;
                    next(error);
                }
                else
                res.json({result: result, msg: "Successfully Updated Todo!", error: null});
            });
        }
    })
});

app.post('/', (req,res,next)=>{
    const userInput = req.body;

    Joi.validate(userInput,schema,(err,result)=>{
        if(err){
            const error = new Error("Invalid Input");
            error.status = 400;
            next(error);
        }
        else{
            db.getDB().collection(collection).insertOne(userInput,(err, result)=>{
                if(err){
                    const error = new Error("Failed to Insert Todo");
                    error.status = 400;
                    next(error);
                }
                else
                res.json({result: result, document: result.ops[0], msg: "Successfully Inserted Todo!", error: null});
            })
        }
    })
});

app.delete('/:id',(req,res)=>{
    const todoID = req.params.id;

    db.getDB().collection(collection).findOneAndDelete({_id : db.getPrimaryKey(todoID)},(err,result)=>{
        if(err)
        console.log(err);
        else
        res.json({result: result, msg: "Successfully Deleted Todo!"});
    });
});

app.use((err,req,res,next)=>{
    res.status(err.status).json({
        error :{
            message : err.message
        }
    });
});

db.connect((err) =>{
    if(err){
        console.log(err);
        process.exit(1);
    }
    else{
        const port = process.env.PORT || 3000
        app.listen(port, () => console.log('Connected to Database, App listening on port 3000'));
    }
});