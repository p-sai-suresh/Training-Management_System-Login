const mongoose=require('mongoose');

const employeeSchema=mongoose.Schema({

    empno:Number,
    empFirstName:String,
    empRole:String,
    password:String,
    empConfirmPassword:String,
 
});

module.exports=mongoose.model('Employee',employeeSchema);