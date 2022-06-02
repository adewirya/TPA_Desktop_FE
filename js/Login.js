window.onload = ()=>{
    let submit = document.getElementById("submit")
    submit.onclick = async ()=>{
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        // window.location.replace('../html/register.html')
        let id = await login(email,password)
        // console.log(id[0].UserId)

        if (id.length == 0){
            document.getElementById("errorMsg").style.display = 'block'
            return;
        }         
        
        let userId = id[0].UserId;
        sessionStorage.setItem('Id', userId);
        
        setOnline(userId);
        
        window.location.replace('../html/home.html')
        // console.log

        // console.log(id)
        // alert(id)
    }
    
}

