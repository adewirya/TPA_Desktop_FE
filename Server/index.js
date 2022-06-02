const Connect = require("./Connect");
const Koa = require("koa");
const Router = require("@koa/router");
const KoaBody = require("koa-body");
const Http = require("http");
const {Server} = require("socket.io");

const app = new Koa();
const router = new Router();
const server = Http.createServer(app.callback());
const io = new Server(server);

router.post("/", async(context ,next)=>{
    const con = await Connect.getConnection();
    const body = context.request.body;
    // console.log(body)
    const [rows, _] = await con.execute(body);
    context.body = rows;
})

var arrOfUid = {};

io.on('connection',async socket => {

    let userId = socket.handshake.query.uId;

    arrOfUid[userId] = socket.id;

    console.log(`${userId} connected`);

    socket.on('message', async e=>{
        
        io.to(socket.id).emit('received', info={
            toId : e.toId,
            msg : e.msg
        });

        io.to(arrOfUid[e.toId]).emit('sent', info= {
            fromId : userId,
            msg : e.msg
        })

    });

    socket.on('newTextChannel', async e =>{
        io.to('server-'+e.sId).emit('newText', info ={
            name : e.name,
            sId : e.sId
        })
    })

    socket.on('newVoiceChannel', async e =>{
        console.log('masuk voice channel')
        io.to('server-'+e.sId).emit('newVoice', info ={
            name : e.name,
            sId : e.sId
        })
    })


    socket.on('join-server', async e =>{
        console.log(socket.id + ' connected to ' + e.ServerId)
        socket.join('server-'+e.ServerId)
        
        io.to('server-'+e.ServerId).emit('newUserServer', info ={
              sId : e.ServerId
        })
    })

    socket.on('text-channel-msg', async e=>{
        console.log('serverId : ' + e.sId + 'Sender : ' + e.senderId + 'Msg : ' + e.msg);
        io.to('server-'+e.sId).emit('newTextMsg', obj = {
            tId : e.tId
        })
    })

    socket.on('disconnect', (e) => {
        // socket.rooms.size === 0
        arrOfUid[e.Id] = undefined;
      });

  });


app.use(KoaBody()).use(router.routes()).use(router.allowedMethods())
server.listen(3000, () => console.log("Listening on http://localhost:3000/" ))


