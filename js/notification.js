socket.on('dmNotification', async (e)=>{
    let data = await selectUser(e.id);
    // console.log('masuk notif');
    showNotification(data[0].Username, e.msg, "Assets/Discord-Logo-White.png");
})

socket.on('textNotification', async (e)=>{
    if (e.senderId == sessionStorage.getItem("Id")){
        return;
    }
    let data = await getTextChannelName(e.tId);
    showNotification(data[0].Name, e.msg, "Assets/Discord-Logo-White.png");
})

var Notification = window.Notification || window.mozNotification || window.webkitNotification;

let showNotification = (name,msg,icon)=>{
    let time = 4000;

    var instance = new Notification(
        name,{
            body: msg,
            icon: icon
        }
    );

    setTimeout(instance.close.bind(instance), time);
    return false;
}