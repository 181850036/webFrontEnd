function getCaptcha() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let captcha = document.getElementById('captcha');
            captcha.innerHTML = xhr.response;
        }
    }
    xhr.open('GET', 'http://localhost:3001/api/captcha', true);
    xhr.send();
}
getCaptcha();
function register() {
    let username = document.getElementById('input_username').value;
    let password = document.getElementById('input_password').value;
    let confirm = document.getElementById('confirm_password').value;
    let captcha = document.getElementById('input_captcha').value;
    let hashPassword =sha256_digest(password);
    let data = {
        "username" : username,
        "password": hashPassword,
        "captcha":captcha

    };
    if(username.length ==0 ){
        alert('请输入用户名！')
        getCaptcha()
        return
    }
    if(password.length ==0 ){
        alert('请输入密码！')
        getCaptcha()
        return
    }
    if(password != confirm ){
        alert('两次密码不一致，请重新输入！')
        getCaptcha()
        return
    }
    if(captcha.length ==0 ){
        alert('请输入验证码!')
        getCaptcha()
        return
    }
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            console.log(xhr.response)
            let res = JSON.parse(xhr.response);
            //let res = xhr.response;
            // console.log(res);
            alert(res.message);
            if(res.message=='注册成功')
            window.location.href = 'http://localhost:3001/login';
            else getCaptcha()
        }
    }
    xhr.open('POST', 'http://localhost:3001/api/register',true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    
}