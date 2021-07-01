const Koa = require('koa')
const route = require('koa-route')
const Pug = require('koa-pug')
const path = require('path')
const websockify = require('koa-websocket')
const serve = require('koa-static')
const app = websockify(new Koa());
const mount = require('koa-mount')
const mongoClient = require('./mongo')

new Pug({
    viewPath: path.resolve(__dirname, '../views'),
     app,
})

const _client = mongoClient.connect()

async function getChatsCollection()
{
    const client = await _client
    return client.db('chat').collection('chats')
}

app.use(mount('/public',serve('src/public')))


app.use(async (ctx) => {
    await ctx.render('main')
})



// Using routes
app.ws.use(route.all('/ws', async (ctx) => {
    const chatsCollection = await getChatsCollection()

    const chatsCursor = chatsCollection.find( {},{
        sort:{
            createdAt:1,
        }
    })

    const chats = await chatsCursor.toArray()
    ctx.websocket.send(
        JSON.stringify({
            type:'sync',
            payload:{
                chats,
            }
        })
    )
    ctx.websocket.on('message', async (data) => {
        if( typeof  data !== 'string')
        {
            return
        }
        console.log(data);

        /** @type {Chat}*/
        const chat = JSON.parse(data)

        await chatsCollection.insertOne(({
            ...chat,
            createdAt: new Date()
        }))
        const {nickname,message} = chat
        const { server } = app.ws
        if(!server)
        {
            return ;
        }

        server.clients.forEach( (client) => {
            client.send(JSON.stringify({
                type: "chat",
                payload:{
                    nickname,
                    message,
                }
            }));
        })
        // broadcast가 아니라 유니캐스트로 보내기 때문에 한사람에게 전달된다.

    });


}));

app.listen(5000)