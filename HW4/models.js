const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/HW1',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
})

const UserSchema = new mongoose.Schema({
    username:{type:String ,unique:true},
    password:{type:String, 
        set(val){
        return val
    }},
    salt:{type:String}
})

//用户模型和字段
const User = mongoose.model('User',UserSchema)
// User.db.dropCollection('users');
//导出用户模型
module.exports = {User}