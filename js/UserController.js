async function register(username, email,password, date){
    let query = `INSERT INTO user(Username, Email, Password, DOB) VALUES ("${username}", "${email}", "${password}", ${date})`;
    console.log(query)

    await queryToServer(query)
}

async function checkEmail(email){
    let query = `SELECT * FROM user WHERE email = '${email}'`

    return await queryToServer(query)
}

async function login (email, password){
    let query = `SELECT UserId FROM user WHERE email= '${email}' AND password= '${password}'`;

    let id = null
    id = await queryToServer(query)
    
    return id
}

async function setOnline(id){
    let query2 = `UPDATE user SET Status = 'Online' WHERE UserId=${id}`;
    await queryToServer(query2);
}

async function logout(id){
    let query2 = `UPDATE user SET Status = 'Offline' WHERE UserId=${id}`;
    await queryToServer(query2);
}

async function searchFriend(name,uId){
    let query = `SELECT * FROM user WHERE Username LIKE '${name}%' AND UserId != ${uId}`;
    let listOfName = await queryToServer(query);

    return listOfName;
}

async function checkFriend(userId){
    let query = `SELECT * FROM relationshipcontroller WHERE UserId='${userId}'`;
    let list = await queryToServer(query);

    return list;
}

async function selectFriends(uId){
    let query = `SELECT FriendId,Status FROM relationshipcontroller WHERE UserId='${uId}'`;
    return await queryToServer(query);
}

async function selectUser(userId){
    let query = `SELECT * FROM user WHERE UserId=${userId} ORDER BY Username`;
    return await queryToServer(query);
}

async function addFriend(userId, friendId){
    let query = `INSERT INTO relationshipcontroller VALUES('${userId}','${friendId}','Pending')`;
    await queryToServer(query);
}

async function checkPending(userId){
    let query = `SELECT * FROM relationshipcontroller WHERE Status = 'Pending' AND FriendId = ${userId}`;
    return await queryToServer(query);
}

async function rejectUser(friendId, userId){
    let query = `DELETE FROM relationshipcontroller WHERE UserId = ${userId} AND FriendId = ${friendId}`;
    await queryToServer(query);
}   

async function acceptUser(friendId, userId){
    // console.log(userId,friendId);
    let query = `UPDATE relationshipcontroller SET Status = 'Friend' WHERE UserId = ${userId} AND FriendId = ${friendId}`;
    let query2 = `INSERT INTO relationshipcontroller VALUES('${friendId}','${userId}','Friend')`;
    await queryToServer(query2);
    await queryToServer(query);
}

async function removeFriend(friendId, userId){
    let query = `DELETE FROM relationshipcontroller WHERE UserId = ${userId} AND FriendId = ${friendId} `;
    let query2 = `DELETE FROM relationshipcontroller WHERE UserId = ${friendId} AND FriendId = ${userId}`;
    
    await queryToServer(query);
    await queryToServer(query2);
}

async function blockFriend(userId, friendId){
    let query = `UPDATE relationshipcontroller SET Status = 'Blocked' WHERE UserId='${userId}' AND FriendId = '${friendId}'`;
    let query2 = `UPDATE relationshipcontroller SET Status = 'Blocked' WHERE UserId='${friendId}' AND FriendId = '${userId}'`
    // console.log(await queryToServer(query));
    await queryToServer(query)
    await queryToServer(query2);
}

async function checkBlocked(userId){
    let query = `SELECT * FROM relationshipcontroller WHERE UserId='${userId}' AND Status='Blocked'`;
    return await queryToServer(query);
}

async function unblock(userId,friendId){
    let query = `UPDATE relationshipcontroller SET Status = 'Friend' WHERE UserId='${userId}' AND FriendId = '${friendId}'`;
    let query2 = `UPDATE relationshipcontroller SET Status = 'Friend' WHERE UserId='${friendId}' AND FriendId = '${userId}'`;
    // console.log('tes')
    // console.log(await queryToServer(query));
    await queryToServer(query);
    await queryToServer(query2);
}

async function changeCred(uId, username, status){
    let query = `UPDATE user SET Username = '${username}', Status = '${status}' WHERE UserId = ${uId}`;
    await queryToServer(query);
}
