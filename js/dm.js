// console.log(sessionStorage.getItem("Id"))


socket.connect()

socket.on('received', async (action) =>{
    let uId = sessionStorage.getItem("Id");
    saveMsgToDB(action.toId, uId, action.msg);
    newMsgLog(uId, action.msg);
})

socket.on('sent', async (e)=>{
    newMsgLog(e.fromId, e.msg);
})
    
let newMsgLog = async (userId, msg) =>{
    let col = chatTemplate.clone();
    let userData = await selectUser(userId);
    col.removeClass('hidden');
    col.find('#sender').html(userData[0].Username);
    col.find('#message').html(msg);
    chatLogList.append(col);
}




