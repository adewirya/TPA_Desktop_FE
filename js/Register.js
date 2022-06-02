window.onload = ()=>{
    let submit = document.getElementById("register")
    submit.onclick = async ()=>{
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let username = document.getElementById("username").value;
        let date = document.getElementById("dob").value
        // window.alert(date)
        let check  = checkEmail(email)
        if (check.length != 0){
            await register(username,email,password,date)

            window.location.replace('../html/login.html')
        }
        else {
            document.getElementById("errorMsg").style.display = 'block'
            return;
        }

    }
    
}

