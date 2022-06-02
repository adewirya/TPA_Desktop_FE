// save msg to db
async function saveMsgToDB(senderId, receiverId, msg){
    let query = `INSERT INTO message VALUES (null, ${senderId}, ${receiverId}, '${msg}')`;
    await queryToServer(query);
}

async function getAllMessage(messageId){
    let query = `SELECT Message FROM message WHERE MessageId = ${messageId}`;
    return await queryToServer(query);
}

async function getMessageId(uId, u2Id){
    let query = `SELECT * FROM message WHERE SenderId=${uId} AND User2Id=${u2Id}`;
    return await queryToServer(query);
}

async function saveTxtChannelMsgToDB(textChannelId, senderId, msg){
    let query = `INSERT INTO textchannelmessage VALUES (${textChannelId}, ${senderId}, '${msg}')`;
    await queryToServer(query);
}

async function getAllTxtChannelMsg(textChannelId){
    let query = `SELECT * FROM textchannelmessage WHERE TextChannelId = ${textChannelId}`;
    return await queryToServer(query);
}
