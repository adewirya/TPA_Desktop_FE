async function queryToServer(query){
    let test = await fetch("http://localhost:3000/", {
        method:"POST",
        body:query
    }).then(x => x.json())
    return test
}

var socket = io("http://localhost:3000", {
    query: {
        uId: sessionStorage.getItem("Id")
    }
})
