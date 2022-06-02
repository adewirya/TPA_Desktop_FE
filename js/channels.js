socket.on('newText', e=>{
    loadText(e.sId);
})          

socket.on('newVoice', e=>{
    loadVoice(e.sId);
    // console.log(e)
})


let newTextChannelMsg = async (userId, msg)=>{
    let userData = await selectUser(userId);
    let temp = textChatTemplate.clone();
    temp.find('#sender-txt').html(userData[0].Username);
    temp.removeClass('hidden');
    temp.find('#message-txt').html(msg);
    textChannelChatLog.append(temp);
    // console.log('masuk')
}

let loadTxtChannelMsg = async (txtChannelId)=>{
    // console.log('masuk')
    textChannelChatLog.empty(); 
    let msgList = await getAllTxtChannelMsg(txtChannelId);
    // console.log(msgList);
    if (msgList.length != 0)
        for (let i = 0; i<msgList.length; i++){
            newTextChannelMsg(msgList[i].SenderId, msgList[i].Message);
        }
    // console.log('masuk')
}

let loadText = async (serverId)=>{
    textList.empty();
    let listText = await getAllTextChannel(serverId);
    for (let i = 0; i<listText.length; i++){
        let temp = textTemplate.clone();
        temp.find('#text-channel-name').html(listText[i].Name)
        temp.removeClass('hidden');
        // temp.attr('id', `text-channel-template-${listText[i].TextChannelId}`);
        temp.on('click', async ()=>{
            // console.log('tess-masukk')
            let head = $('#text-channel-header')
            head.removeClass('hidden');
            head.find('#text-channel-header-name').html(listText[i].Name);
            txtChannelId = listText[i].TextChannelId
            $('#text-header').append(head);
            textContent.removeClass('hidden');
            // console.log(txtChannelId)
            await loadTxtChannelMsg(listText[i].TextChannelId);
        })
        textList.append(temp);
    }
}

let loadVoice = async (serverId)=>{
    voiceList.empty()
    let listVoice = await getAllVoiceChannel(serverId);
    for (let i= 0; i<listVoice.length;  i++){
        let temp = voiceTemplate.clone();
        temp.find('#voice-channel-name').html(listVoice[i].Name);
        temp.removeClass('hidden');
        // console.log(i);
        temp.on('click', ()=>{
            // console.log('masuk');
            let name = userData[0].Username;
            if (temp.find(`#user-call-template-${name}`).length == 0){
                let a = userCallTemplate.clone();
                a.attr('id', `user-call-template-${name}`);
                a.html(name);
                temp.find('#user-call-list').append(a);
            }
        })
        voiceList.append(temp)
    }
}