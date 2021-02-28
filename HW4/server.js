const {User} = require('./models')

const express = require('express'); //引用express
const session = require('express-session');
const crypto = require('crypto');
var SHA256 = require('crypto-js/sha256');

const app = express(); //express实例

const svgCaptcha = require('svg-captcha');

app.use(session({
    secret: 'fadsfsdafas',
    cookie: { maxAge: 120000000000 },
    resave: false,
    saveUninitialized: true,
}));


app.get('/api/captcha', function (req, res) {
    let cap = svgCaptcha.create({
        inverse: false,
        fontSize: 36,
        ignoreChars: '0o1i',
        noise: 3,
        width: 80,
        height: 30
    });
    req.session.captcha = cap.text;
    res.type('svg');
    res.send(cap.data);
});

// module.exports = router;

app.use(express.json());

const path = require('path');

app.get('/login', (req, res) => res.sendFile(__dirname + '/login.html'))
app.get('/copy', (req, res) => res.sendFile(__dirname + '/copy.html'))
app.get('/register', (req, res) => res.sendFile(__dirname + '/register.html'))
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/imgs', express.static(path.join(__dirname, 'imgs')));
app.use('/font-awesome-4.7.0', express.static(path.join(__dirname, 'font-awesome-4.7.0')));
app.use('/photos', express.static(path.join(__dirname, 'photos')));
app.get('/homePage', (req, res) => res.sendFile(__dirname + '/homePage.html'))
app.get('/wallPapers', (req, res) => res.sendFile(__dirname + '/wallPapers.html'))
app.get('/api/users',async(req,res)=>{ //接口
    const users = await User.find()
    res.send(users); 
})
 
app.post('/api/register',async(req,res)=>{ //接口
    
    console.log(req.body)
    const isNameExist = await User.findOne({
        username:req.body.username
    })
    if(isNameExist) return res.send({
        message:'用户名已存在，请重新输入'
    })
    if (req.body.captcha != req.session.captcha.toLowerCase()) {
        return res.status(422).send({
            message:'验证码错误'
        })
    }
    let salt = crypto.randomBytes(5).toString('hex'); // 5字节生成10个16进制字符
    let saltPassWord = SHA256(req.body.password + salt).toString();
    const user = await User.create({
        username : req.body.username,
        password : saltPassWord,
        salt : salt
    })
    res.send({
        message:'注册成功'
    }); 
})

app.post('/api/login',async(req,res)=>{ //接口

    console.log(req.body)

    const user = await User.findOne({
        username:req.body.username
    })
    if(!user){
        return res.status(422).send({
            message: '用户名不存在'
        })
    }
    let saltPassWord = SHA256(req.body.password+user.salt)
    if(saltPassWord!=user.password){
        return res.status(422).send({
            message: '密码错误'
        })
    }
    let captcha = req.body.captcha.toLowerCase();
    if (captcha != req.session.captcha.toLowerCase()) {
        return res.status(422).send({
            message:'验证码错误'
        })
    }
    return res.send({
        message:'登录成功'
    });
})

app.listen(3001,()=>{ //开启服务器监听
    console.log('http://localhost:3001/login');
})