//IIFE
;(() => {
    const socket = new WebSocket(`ws://${window.location.host}/ws`);
    const formEl = document.getElementById('form');

    /** @type {HTMLInputElement | null}*/
    const inputEl = document.getElementById('input')
    const chatlistEl = document.getElementById('chatlist')
    if(!formEl)
    {
        throw new Error('Init failed');
    }

    /**
     * @typedef Chat
     * @property {string} nickname
     * @property {string} message
     * */

    /**
     * @type {Chat[]}
     * */
    const chats =[]
    const adjectives = ['a','b','c','d','e'];
    const tail = ['hi','hello','bye'];

    /**
     * @param {string[]} array
     * @returns {string}
     *  */
    function pickRn(array)
    {
        const rdMix = Math.floor(Math.random()*array.length);
        const result = array[rdMix];
        if(!result) throw new Error('array lenght is 0.');
        return result;
    }

    const rdnick = `${pickRn(adjectives)}${pickRn(tail)}`;
    formEl.addEventListener('submit',(event) => {
        event.preventDefault()
        socket.send(JSON.stringify(
            {
                nickname : rdnick,
                message : inputEl.value
            }
        ))
        inputEl.value = ''
    })

    const  drawChats = () =>
    {
        chatlistEl.innerHTML=''
        chats.forEach(({message,nickname}) => {
            const div = document.createElement('div')
            div.innerText = `${nickname} : ${message}`
            chatlistEl.appendChild(div)
        })

    }
    socket.addEventListener('message',(event) => {
        const { type,payload } = JSON.parse(event.data)

        if(type ==='sync')
        {
            const {chats: syncedChats} = payload
            chats.push(...syncedChats)
        }else if ( type === 'chat'){
            const _chat = payload
            chats.push(_chat)
        }

        drawChats()

    })
})()