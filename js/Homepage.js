window.onload = async () => 
{
    var u2Id = 0;
    var serverId = 0;
    var txtChannelId = 0;
    var selectedId = 0;
    var userRole = "";
    let dropdown = document.getElementById("dropdown")
    let profiledrop = document.getElementById("profileDropdown")

    profiledrop.onmouseenter = ()=>{
        dropdown.style.display = "block";
    }

    dropdown.onmouseleave = ()=>{
        dropdown.style.display = "none";
    }

    var uId = sessionStorage.getItem("Id");
    let userData = await selectUser(uId);


    $('#profile-name').val(userData[0].Username)
    $('#profile-status').val(userData[0].Status);
    $('#go-back').on('click', async ()=>{
        $('#profile').addClass('hidden');
        let name = $('#profile-name').val();
        let status = $('#profile-status').val();
        await changeCred(uId, name,status);
    })

    $('#menu-0-item-0').on('click', ()=>{
        $('#profile').removeClass('hidden');
    })

    // console.log(uId);
    $('#friends').on('click', ()=>{
        $('#friends').css('background-color ', 'gray');
    })


    
    $('#signOut').on('click', async ()=>{
        // console.log(uId);
        await logout(uId);
        socket.disconnect();
        window.location.replace('../html/login.html')
        // head.empty();
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

    socket.on('newTextMsg', async e =>{
        // console.log('new msg masuk')
        loadTxtChannelMsg(e.tId);
    })

    $('#send-message-text-channel').submit(async function(){
        let msg = $('#input-msg-text-channel').val();
        // console.log(msg)
        let uId = sessionStorage.getItem("Id");
        if (msg != ''){
            await saveTxtChannelMsgToDB(txtChannelId, uId, msg);
            socket.emit('text-channel-msg', e = {
                sId : serverId,
                tId : txtChannelId,
                msg : msg,
                senderId : uId
            })
        }
        // loadTxtChannelMsg(txtChannelId);
    })

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


    let loadUserServer = async (serverId)=>{
        ownerList.empty();
        adminList.empty();
        memberList.empty();
        let userList = await getAllServerPeople(serverId);
        for (let i = 0; i<userList.length; i++){
            let userData = await selectUser(userList[i].userId);
            let temp;
            if (userList[i].Role == 'Owner'){
                temp = ownerTemplate;
                temp.find('#owner-name').html(userData[0].Username);
                temp.find('#owner-status').html(userData[0].Status);
                temp.find('#owner-nickname').html(userList[i].Nickname);
                temp.find('#custom-owner-status').html(userList[i].CustomStatus);
                temp.removeClass('hidden')
                if (userRole == 'Owner'){
                    temp.on('click',()=>{
                        mU.removeClass('hidden');
                    })
                }
                ownerList.append(temp)
            }
            else if (userList[i].Role == 'Admin'){
                temp = adminTemplate.clone()
                temp.find('#admin-name').html(userData[0].Username);
                temp.find('#admin-status').html(userData[0].Status);
                temp.find('#admin-nickname').html(userList[i].Nickname);
                temp.find('#custom-admin-status').html(userList[i].CustomStatus);
                temp.removeClass('hidden')
                if (userRole == 'Owner'){
                    temp.on('click', ()=>{
                        selectedId = userList[i].userId;   
                        dPopup.removeClass('hidden');
                    })
                }
                else if (userRole == 'Admin'){
                    temp.on('click',()=>{
                        mU.removeClass('hidden');
                    })
                }
                adminList.append(temp);
            }
            else {
                temp = memberTemplate.clone();
                temp.find('#member-name').html(userData[0].Username);
                temp.find('#member-status').html(userData[0].Status);
                temp.find('#member-nickname').html(userList[i].Nickname);
                temp.find('#custom-member-status').html(userList[i].CustomStatus);
                temp.removeClass('hidden')

                if (userRole == 'Owner'){
                    temp.on('click',()=>{
                        selectedId = userList[i].userId;   
                        pPopup.removeClass('hidden');
                    })
                }
                else if (userRole == 'Member'){
                    temp.on('click',()=>{
                        mU.removeClass('hidden');
                    })
                }
                memberList.append(temp);
            }
        }
    }
    $('#m-promote-btn').on('click',async ()=>{
        await promoteUser(serverId, selectedId);
        socket.emit('join-server', e = {
            ServerId : serverId
        });
        pPopup.addClass('hidden')
    })

    $('#m-cancel-btn').on('click', ()=>{
        pPopup.addClass('hidden')
    })

    $('#d-demote-btn').on('click',async ()=>{
        await demoteUser(serverId,selectedId);
        socket.emit('join-server', e = {
            ServerId : serverId
        });
        dPopup.addClass('hidden');
    })

    $('#d-cancel-btn').on('click', ()=>{
        dPopup.addClass('hidden');
    })

    $('#u-btn').on('click', async ()=>{
        let nick = $('#u-nickname').val();
        let stat = $('#u-status').val();
        await updateUser(serverId, uId, nick, stat);
        socket.emit('join-server', e={
            ServerId : serverId
        })
        
        mU.addClass('hidden');
    })

    $('#u-cancel').on('click', ()=>{
        mU.addClass('hidden');
    })


    socket.on('newUserServer', async e =>{
        // console.log('masuk')
        // console.log(e.sId)
        let test = await checkUserRole(e.sId, sessionStorage.getItem("Id"));
        // console.log(test);
        userRole = test[0].Role;
        if (userRole == 'Member'){
            $('#add-new-text-channels').hide();
            $('#add-new-voice-channels').hide();
        }
        else {
            $('#add-new-text-channels').show();
            $('#add-new-voice-channels').show();
        }
        showAllServer(uId);
        loadUserServer(e.sId);
    })

    socket.on('newUpdateServer', e =>{
        // console.log('masuk');
        serverUI.find('#header-server-name').html(`#${e.sId} ${e.sName} Server`)
    })

    // show all server
    async function showAllServer(uId){
        serverList.empty(); 
        search.hide();
        // serverUI.addClass('hidden')
        let servers = await getAllServer(uId);
        if (servers.length != 0){
            for (let i= 0 ; i<servers.length; i++){
                let serverTemp = serverTemplate.clone()
                // console.log(servers)

                serverTemp.find('#addServer').attr("title", servers[i].Name);
                // console.log(serverList[i].Name);
                serverTemp.removeClass('hidden');
                // sett server
                serverTemp.on('click', async ()=>{
                    search.hide();
                    searchContent.empty();
                    pendingList.empty();
                    chatLog.empty();
                    chatLogList.empty();
                    onlineList.empty();
                    allList.empty();
                    
                    friendsDiv.addClass('hidden');
                    let cont = serverUI;
                    cont.removeClass('hidden');
                    // console.log(servers);
                    cont.find('#header-server-name').html(`#${servers[i].ServerId} ${servers[i].Name} Server`);
                    cont.find('#header-server-name').attr('title', servers[i].ServerId);
                    cont.find('#manage-server').on('click', ()=>{
                        // console.log('masuk')
                        mS.removeClass('hidden');
                    })
                    serverId = servers[i].ServerId;
                    let test = await checkUserRole(serverId, uId);
                    // console.log(test);
                    userRole = test[0].Role;
                    console.log(userRole)
                    socket.emit('join-server', e ={
                        ServerId : serverId
                    })
                    
                    if (userRole == 'Member'){
                        cont.find('#add-new-text-channels').hide();
                        cont.find('#add-new-voice-channels').hide();
                    }
                    else {
                        cont.find('#add-new-text-channels').attr('id', `add-new-text-channels-${servers[i].ServerId}`);
                        cont.find('#add-new-voice-channels').attr('id', `add-new-voice-channels-${servers[i].ServerId}`);
                        cont.on('click',`#add-new-text-channels-${servers[i].ServerId}`, async ()=>{
                            // console.log('masuk text');
                            addText.removeClass('hidden');
                        })
                        cont.on('click', `#add-new-voice-channels-${servers[i].ServerId}`, async ()=>{
                            addVoice.removeClass('hidden');
                        })
                    }
                    loadText(serverId);
                    loadVoice(serverId);
                })
                serverList.append(serverTemp);
            }
        }
    }

    socket.on('deleteServer', e =>{
        console.log('masuk')
        serverUI.addClass('hidden') 
        showAllServer(e.uId)
    })


    $('#c-new-text').on('click',async ()=>{
        let textName = $('#new-text-name').val();
        if (textName != ''){

            await newTextChannel(serverId, textName);
            socket.emit('newTextChannel', obj ={
                sId : serverId,
                name : textName
            })
        }
        addText.addClass('hidden');
    })

    $('#c-cancel').on('click', ()=>{
        addText.addClass('hidden'); 
    })

    $('#v-create').on('click', async ()=>{
        let newVoiceTEXT = $('#new-voice-name'). val();
        console.log(serverId)
        if (newVoiceTEXT != ''){
            await newVoiceChannel(serverId, newVoiceTEXT);
            socket.emit('newVoiceChannel', obj ={
                sId : serverId,
                name : newVoiceTEXT
            })
        }
        addVoice.addClass('hidden');
        // loadVoice(serverId);
    })

    $('#v-cancel').on('click', ()=>{
        addVoice.addClass('hidden');
    })

    await showAllServer(uId);
    

    $('#add-friend').on('click', ()=>{
        searchContent.empty();
        pendingList.empty();
        chatLog.empty();
        serverUI.addClass('hidden')
        onlineList.empty();
        allList.empty();

        friendsDiv.addClass('hidden');
        search.show();

        // search.addClass('block');
        // head.append(search)
        // console.log('tes')
    })

    $('#friends').on('click', ()=>{
        serverUI.addClass('hidden')
        $('#all').first().click();
    })

    $('#search-friend').submit(async function(e){
        // console.log('tes')
        serverUI.addClass('hidden')
        searchContent.empty();
        chatLog.empty();
        pendingList.empty();

        let name= document.getElementById('search-bar-friend').value;
        let list = await searchFriend(name,uId);
        let listFriends = await checkFriend(uId);

        // console.log(list[0].Username);
        for (let i = 0; i<list.length; i++){
            let column = templateSearch.clone();
            
            column.find("#name").html(list[i].Username);
            column.find("#status").html(list[i].Status);

            column.attr("id", `template-search-${list[i].UserId}`);

            column.removeClass('hidden');
            
            // console.log(list[i].Username);
            // console.log(listFriends[i].Status == 'Friend')
            for (let j=0; j<listFriends.length; j++){
                    if ((listFriends[j].Status == 'Friend' || listFriends[j].Status == 'Pending' || listFriends[j].Status == 'Blocked') && (listFriends[j].FriendId == list[i].UserId || listFriends[j].UserId == list[i].UserId)){
                        column.find("#add-friend-selected").hide();
                    }
            }
            column.find("#add-friend-selected").attr("id",`add-friend-selected-${list[i].UserId}`);
            column.on("click", `#add-friend-selected-${list[i].UserId}`, async ()=>{
                await addFriend(uId, list[i].UserId);
                column.hide();
            })

            column.find("#chat-selected").attr("id",`chat-selected-${list[i].UserId}`);
            column.on('click', `#chat-selected-${list[i].UserId}`, ()=>{
                allList.empty();
                chatLog.empty();
                chatLogList.empty();
                pendingList.empty();
                onlineList.empty();
                searchContent.empty();
                search.hide();

                // show chat log
                let cont = chatCont
                cont.find('#header').find('#name').html(list[0].Username);
                cont.find('#header').find('#status').html(list[0].Status);
                cont.removeClass('hidden');
                u2Id = list[0].UserId;
                loadMsg()
                cont.find('#send-message').submit( function(e) {
                    // console.log('masuk')

                    let msg = $('#send-message').find('#bot-1').find('#message-send').val()
                    let send = {
                        toId : u2Id,
                        msg : msg
                    }
                
                    socket.emit('message', send);
                
                    e.preventDefault();
                })

                chatLog.append(cont);
                if (dmList.find(`#dmTemplate-${list[0].UserId}`).length == 0){
                    let dmTemp = dmTemplate.clone();
                        dmTemp.attr("id", `dmTemplate-${list[0].UserId}`);
                        dmTemp.find('#name').html(list[0].Username);
                        dmTemp.find('#status').html(list[0].Status);
                        if (list[0].Status == 'Online'){
                            dmTemp.find('#ring-status').removeClass('bg-red-400');
                            dmTemp.find('#ring-status').addClass('bg-green-400');
                        }
                        dmTemp.removeClass('hidden');
    
                        dmTemp.on('click', ()=>{
                            chatLog.empty();
                            // chatCont.empty();
                            chatLogList.empty();
                            allList.empty();
                            pendingList.empty();
                            onlineList.empty();
                            searchContent.empty();
                            search.hide();
                            
                            let cont = chatCont
                            cont.find('#header').find('#name').html(list[0].Username);
                            cont.find('#header').find('#status').html(list[0].Status);
                            cont.removeClass('hidden');
                            u2Id = list[0].UserId;
                            loadMsg()
                            cont.find('#send-message').submit( function(e) {
                                // console.log('masuk')
            
                                let msg = $('#send-message').find('#bot-1').find('#message-send').val()
            
            
                                let send = {
                                    toId : u2Id,
                                    msg : msg
                                }
                                
                                socket.emit('message', send);
                            
                                e.preventDefault();
                            })
                            chatLog.append(cont);
                        })   
                        dmList.append(dmTemp);
                }
            
            })
            searchContent.append(column);
        }
        // console.log(list)

        e.preventDefault();
    })

    $('#all').on('click', async ()=>{
        allList.empty();
        serverUI.addClass('hidden')
        chatLog.empty();
        pendingList.empty();
        onlineList.empty();
        searchContent.empty();
        search.hide();
        let friendList = await selectFriends(uId);
        // console.log(friendList)
        for (let i = 0; i<friendList.length; i++){
            let list = await selectUser(friendList[i].FriendId);
            if (friendList[i].Status == 'Friend'){
                let column  = onlineTemplate.clone();
            // column.attr("id",`online-template-${list[0].UserId}`);
            column.on('click', ()=>{
                chatLog.empty();
                allList.empty();
                pendingList.empty();
                onlineList.empty();
                searchContent.empty();
                search.hide();

                let cont = chatCont
                cont.find('#header').find('#name').html(list[0].Username);
                cont.find('#header').find('#status').html(list[0].Status);
                cont.removeClass('hidden');
                u2Id = list[0].UserId;
                loadMsg()
                cont.find('#send-message').submit( function(e) {
                    // console.log('masuk')

                    let msg = $('#send-message').find('#bot-1').find('#message-send').val()

                    let send = {
                        toId : u2Id,
                        msg : msg
                    }
                
                    socket.emit('message', send);
                
                    e.preventDefault();
                })
                chatLog.append(cont);

                // console.log(dmList.find(`#dmTemplate-${list[0].UserId}`))

                if (dmList.find(`#dmTemplate-${list[0].UserId}`).length == 0){

                    let dmTemp = dmTemplate.clone()
                    dmTemp.attr("id", `dmTemplate-${list[0].UserId}`);
                    u2Id = list[0].UserId;
                    dmTemp.find('#name').html(list[0].Username);
                    dmTemp.find('#status').html(list[0].Status);
                    dmTemp.removeClass('hidden');
                    
                    
                    
                    dmTemp.on('click', ()=>{
                        chatLog.empty();
                        allList.empty();
                        pendingList.empty();
                        onlineList.empty();
                        searchContent.empty();
                        search.hide();
        
                        let cont = chatCont
                        cont.find('#header').find('#name').html(list[0].Username);
                        cont.find('#header').find('#status').html(list[0].Status);
                        u2Id = list[0].UserId;
                        loadMsg()
                        cont.find('#send-message').submit( function(e) {
                            // console.log('masuk')
        
                            let msg = $('#send-message').find('#bot-1').find('#message-send').val()
                            let send = {
                                toId : u2Id,
                                msg : msg
                            }
                        
                            socket.emit('message', send);
                        
                            e.preventDefault();
                        })

                        cont.removeClass('hidden');
                        chatLog.append(cont);
                    })

                    dmList.append(dmTemp);
                }

            })
            column.removeClass('hidden');
            
            column.find('#remove-friend-selected').attr("id",`remove-friend-selected-${list[0].UserId}`);
            column.find('#block-friend-selected').attr("id", `block-friend-selected-${list[0].UserId}`);

            column.on('click', `#remove-friend-selected-${list[0].UserId}`,async ()=>{
                await removeFriend(uId,list[0].UserId);
                chatLog.empty();
                column.hide();
            })
            

            column.on('click', `#block-friend-selected-${list[0].UserId}`, async ()=>{
                await blockFriend(uId, list[0].UserId);
                chatLog.empty();
                column.hide();
            })


            if (list[0].Status == 'Online'){
                column.find('#ring-status').removeClass('bg-red-400');
                column.find('#ring-status').addClass('bg-green-400');
            }
           
            column.find('#name').html(list[0].Username);
            column.find('#status').html(list[0].Status);
    
            allList.append(column);
        }
        }
    })

    $('#online').on('click', async ()=>{
        chatLog.empty();
        serverUI.addClass('hidden')
        allList.empty();
        onlineList.empty();
        pendingList.empty();
        searchContent.empty();
        search.hide();
        let friendList = await selectFriends(uId);
        for (let i = 0; i<friendList.length; i++){
            let list = await selectUser(friendList[i].FriendId);
            
            
            if (list[0].Status == 'Online' && friendList[i].Status == 'Friend'){
                let column  = onlineTemplate.clone();
                column.removeClass('hidden');
                
                column.find('#remove-friend-selected').attr("id",`remove-friend-selected-${list[0].UserId}`);
                column.find('#block-friend-selected').attr("id", `block-friend-selected-${list[0].UserId}`);

                column.on('click', ()=>{
                    chatLog.empty();
                    allList.empty();
                    pendingList.empty();
                    onlineList.empty();
                    searchContent.empty();
                    search.hide();
    
                    let cont = chatCont
                    cont.find('#header').find('#name').html(list[0].Username);
                    cont.find('#header').find('#status').html(list[0].Status);
                    cont.removeClass('hidden');
                    u2Id = list[0].UserId;
                    loadMsg()
                    cont.find('#send-message').submit( function(e) {
                        // console.log('masuk')
    
                        let msg = $('#send-message').find('#bot-1').find('#message-send').val()

                        let send = {
                            toId : u2Id,
                            msg : msg
                        }
                    
                        socket.emit('message', send);
                    
                        e.preventDefault();
                    })
                    chatLog.append(cont);
    
                    // console.log(dmList.find(`#dmTemplate-${list[0].UserId}`))
    
                    if (dmList.find(`#dmTemplate-${list[0].UserId}`).length == 0){
    
                        let dmTemp = dmTemplate.clone();
                        dmTemp.attr("id", `dmTemplate-${list[0].UserId}`);
                        dmTemp.find('#name').html(list[0].Username);
                        dmTemp.find('#status').html(list[0].Status);
                        dmTemp.removeClass('hidden');
    
                        dmTemp.on('click', ()=>{
                            chatLog.empty();
                            allList.empty();
                            pendingList.empty();
                            onlineList.empty();
                            searchContent.empty();
                            search.hide();
            
                            let cont = chatCont
                            cont.find('#header').find('#name').html(list[0].Username);
                            cont.find('#header').find('#status').html(list[0].Status);
                            cont.removeClass('hidden');
                            u2Id = list[0].UserId;
                            loadMsg()
                            cont.find('#send-message').submit( function(e) {
                                // console.log('masuk')
            
                                let msg = $('#send-message').find('#bot-1').find('#message-send').val()
            
                                // console.log(msg)
            
                                let send = {
                                    toId : u2Id,
                                    msg : msg
                                }
                                
                                socket.emit('message', send);
                            
                                e.preventDefault();
                            })
                            chatLog.append(cont);
                        })
                        
                        if (list[0].Status  == 'Online'){
                            dmTemp.find('#ring-status').removeClass('bg-red-400');
                            dmTemp.find('#ring-status').addClass('bg-green-400');
                        }
                        // code to loop and get message from db here
    
                        
                        dmList.append(dmTemp);
                    }
    
                })

                column.on('click', `#remove-friend-selected-${list[0].UserId}`,async ()=>{
                    await removeFriend(uId,list[0].UserId);
                    column.hide();
                })
                

                column.on('click', `#block-friend-selected-${list[0].UserId}`, async ()=>{
                    await blockFriend(uId, list[0].UserId);
                    column.hide();
                })
                

                if (list[0].Status == 'Online'){
                    column.find('#ring-status').removeClass('bg-red-400');
                    column.find('#ring-status').addClass('bg-green-400');
                }

                column.find('#name').html(list[0].Username);
                column.find('#status').html(list[0].Status);
    
                onlineList.append(column);
            }
        }
    })

    $('#ms-u').on('click', async ()=>{
        let sName = $('#u-name').val();
        await updateServer(serverId, sName);

        socket.emit('update-server', e={
            sId : serverId,
            sName : sName
        })
        // serverUI.find('#header-server-name').html(`#${serverId} ${sName} Server`)
        mS.addClass('hidden');
    })

    $('#ms-d').on('click', async ()=>{
        await deleteServer(serverId);
        socket.emit('delete-server', e={
            sId : serverId,
            uId : sessionStorage.getItem("Id") 
        })
        mS.addClass('hidden');
    })

    let s = $('#serverPopup');
    let joinP = $('#j-server');
    // console.log(joinP)

    $('#addServer').on('click', ()=>{
        s.removeClass('hidden');
        $('#server-name').attr('placeholder',`${userData[0].Username}'s server name`);
    })


    $('#s-cancel-btn').on('click', ()=>{
        s.addClass('hidden');
    })

    $('#s-create-btn').on('click',async ()=>{
        let name = $('#server-name').val();
        if (name == ''){
            s.addClass('hidden');
            return;
        }
        
        let uId = sessionStorage.getItem("Id");
        // console.log(name);
        await newServer(uId, name);
        let id = await selectServer(uId,name);
        console.log(id);
        let sid = id[0].ServerId
        socket.emit('join-server', obj ={
            ServerId : sid
        })  

        s.addClass('hidden');
        // window.refresh()
        await showAllServer(uId);
    })

    $('#s-join-btn').on('click', ()=>{
        s.addClass('hidden');
        joinP.removeClass('hidden');
    })

    $('#j-join-btn').on('click', async ()=>{
        let id = $('#join-server-id').val();
        if (id == '')
            return;

        console.log(id);
        let check = await checkServer(id, uId);
        console.log(check)

        if (check.length != 0){
            socket.emit('join-server', obj ={
                ServerId : id   
            })
            await addMemberToServer(id, uId);
        }
        else {
            joinP.addClass('hidden')
            return;
        }
        serverList.empty();
        // await showAllServer(uId);
        joinP.addClass('hidden');
    })

    $('#j-cancel-btn').on('click', ()=>{
        joinP.addClass('hidden');
        // console.log('masuk')
    })



    $('#pending').on('click', async ()=>{
        chatLog.empty();
        serverUI.addClass('hidden')
        onlineList.empty();
        allList.empty();
        pendingList.empty();
        // console.log('tes')
        searchContent.empty();
        search.hide()


        let list = await checkPending(uId);
        // console.log(list)

        if (list.length != 0){
            for (let i = 0; i<list.length; i++){

                let column =  templatePending.clone();
                column.removeClass('hidden');

                // console.log(FriendId)    
                let userList = await selectUser(list[i].UserId);
    
                column.find("#name").html(userList[0].Username);
                column.find('#reject-friend-selected').attr("id", `reject-friend-selected-${list[i].UserId}`);
                column.find('#accept-friend-selected').attr("id", `accept-friend-selected-${list[i].UserId}`);
    
    
                column.on("click", `#reject-friend-selected-${list[i].UserId}`, async ()=>{
                    await rejectUser(uId, list[i].UserId);
                    column.hide();
                })
    
                column.on("click", `#accept-friend-selected-${list[i].UserId}`, async ()=>{
                    await acceptUser(uId, list[i].UserId);
    
                    column.hide();
                })

                
    
                pendingList.append(column);
            }
        }
        // validasi klo pending list kosong maka show apa dibawah sini

    })

    $('#blocked').on('click', async ()=>{
        onlineList.empty();
        chatLog.empty();
        serverUI.addClass('hidden')
        pendingList.empty();
        searchContent.empty();
        search.hide();
        allList.empty();
        blockedList.empty();

        // console.log(uId);
        let friendList = await checkBlocked(uId);
        // console.log(friendList)
        for (let i = 0; i<friendList.length; i++){
            let user = await selectUser(friendList[i].FriendId);
            console.log(user)
            let column = blockedTemplate.clone();
            column.find('#name').html(user[0].Username);
            column.removeClass('hidden');
            column.find('#status').html(user[0].Status);
            column.find('#unblock-friend-selected').attr('id', `unblock-friend-selected-${user[0].UserId}`);

            column.on('click',`#unblock-friend-selected-${user[0].UserId}`, async ()=>{
                await unblock(uId, user[0].UserId);
                column.hide();
            })

            blockedList.append(column);
        }


    })

    let newMsgLog = async (userId, msg) =>{
        let col = chatTemplate.clone();
        let userData = await selectUser(userId);
        col.removeClass('hidden');
        col.find('#sender').html(userData[0].Username);
        col.find('#message').html(msg);
        chatLogList.append(col);
    }

    let loadMsg = async () =>{
        let chatId = await getMessageId(uId,u2Id);
        let chat2Id = await getMessageId(u2Id, uId);

        if (chatId != ''){
            for (let i =0 ; i<chatId.length; i++){
                newMsgLog(chatId[i].SenderId, chatId[i].Message);
            }
        }
        
        if (chat2Id != ''){
            for (let i =0 ; i<chat2Id.length; i++){
                newMsgLog(chat2Id[i].SenderId, chat2Id[i].Message);
            }
        }
    }

}