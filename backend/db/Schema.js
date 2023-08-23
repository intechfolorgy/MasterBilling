const mongooose = require('mongoose')

const Schema = new mongooose.Schema({
    name:{
        type:String,
        required:true
    },
    contactnumber:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
module.exports = mongodb = mongooose.model('mongodb' , Schema);