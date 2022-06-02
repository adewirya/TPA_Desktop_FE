async function newServer(ownerId,name){
    let query = `INSERT INTO servercontroller (Name,OwnerId) VALUES ('${name}', ${ownerId})`;
    await queryToServer(query);

    let list = await selectServer(ownerId, name);
    // console.log(list);
    let id = list[0].ServerId;
    let query2 = `INSERT INTO members VALUES (${id}, ${ownerId}, 'Owner', null , null)`;
    // console.log(query2);
    await queryToServer(query2);
}

async function selectServer(ownerId, name){
    let query = `SELECT * FROM servercontroller WHERE OwnerId = ${ownerId} AND Name = '${name}'`;
    return await queryToServer(query);
}

async function getAllServer(ownerId){
    let query = `SELECT * FROM servercontroller s JOIN members m ON m.ServerId = s.ServerId WHERE m.UserId = ${ownerId}`;
    return await queryToServer(query);
}

async function getServerMembers(serverId){
    let query = `SELECT * FROM members WHERE ServerId = ${serverId}`;
    return await queryToServer(query);
}

async function addMemberToServer(serverId, userId){
    let query = `INSERT INTO members VALUES (${serverId}, ${userId}, 'Member', null, null)`;
    await queryToServer(query);
}

async function checkServer(serverId, uId){
    let query = `SELECT * FROM servercontroller s JOIN members m ON s.ServerId = m.ServerId WHERE m.userId != ${uId} AND s.ServerId = ${serverId}`;
    return await queryToServer(query);
}

async function newTextChannel(serverId, name){
    let query = `INSERT INTO textchannel VALUES (null, ${serverId}, '${name}')`;
    await queryToServer(query);
}

async function newVoiceChannel(serverId, name){
    let query = `INSERT INTO voicechannel VALUES (null, ${serverId}, '${name}')`;
    await queryToServer(query);
}

async function getAllVoiceChannel(serverId){
    let query = `SELECT * FROM voicechannel WHERE ServerId = ${serverId}`;
    return await queryToServer(query);
}

async function getAllTextChannel(serverId){
    let query = `SELECT * FROM textchannel WHERE ServerId = ${serverId}`;
    return await queryToServer(query);
}

async function getAllServerPeople(serverId){
    let query = `SELECT * FROM members WHERE ServerId = ${serverId}`;
    return await queryToServer(query);
}

async function checkUserRole(serverId, userId){
    let query = `SELECT * FROM members WHERE ServerId = ${serverId} AND UserId = ${userId}`;
    return await queryToServer(query);
}

async function promoteUser(serverId, userId){
    let query = `UPDATE members SET Role = 'Admin' WHERE ServerId = ${serverId} and UserId = ${userId}`;
    await queryToServer(query);
}

async function demoteUser(serverId, userId){
    let query = `UPDATE members SET Role = 'Member' WHERE ServerId = ${serverId} and UserId = ${userId}`;
    await queryToServer(query);
}

async function updateUser(serverId, userId, nickName, status){
    let query = `UPDATE members SET Nickname = '(${nickName})', CustomStatus = '(${status})' WHERE ServerId = ${serverId} AND UserId = ${userId}`;
    await queryToServer(query);
}

async function deleteServer(serverId){
    let query = `DELETE FROM servercontroller WHERE ServerId = ${serverId}`;
    await queryToServer(query);
    let query2 = `DELETE FROM members WHERE ServerId = ${serverId}`;
    await queryToServer(query2);
    let query3 = `DELETE FROM textchannel WHERE ServerId = ${serverId}`;
    let query4= `DELETE FROM voicechannel WHERE ServerId = ${serverId}`;
    await queryToServer(query3)
    await queryToServer(query4)
}

async function updateServer(serverId, name){
    let query = `UPDATE servercontroller SET Name = '${name}' WHERE ServerId = ${serverId}`;
    await queryToServer(query);
    
}

async function getTextChannelName (tId){
    let query = `SELECT Name FROM textchannel WHERE TextChannelId=${tId}`;
    return await queryToServer(query);
}