const Koa = require('koa')
const route = require('koa-route')
const Pug = require('koa-pug')
const path = require('path')
const websockify = require('koa-websocket')
const serve = require('koa-static')
const app = websockify(new Koa());
const mount = require('koa-mount')
new Pug({
    viewPath: path.resolve(__dirname, '../views'),
     app,
})

app.use(mount('/public',serve('src/public')))


app.use(async (ctx) => {
    await ctx.render('main')
})
// Using routes
app.ws.use(route.all('/ws', (ctx) => {
    ctx.websocket.on('message', (data) => {
        if( typeof  data !== 'string')
        {
            return
        }
        console.log(data);
        const {nickname,message} = JSON.parse(data)
        const { server } = app.ws
        if(!server)
        {
            return ;
        }

        server.clients.forEach( (client) => {
            client.send(JSON.stringify({
                nickname,
                message,
            }));
        })
        // broadcast가 아니라 유니캐스트로 보내기 때문에 한사람에게 전달된다.

    });


}));

app.listen(5000)