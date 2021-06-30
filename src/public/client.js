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
    formEl.addEventListener('submit',(event) => {
        event.preventDefault()
        socket.send(JSON.stringify(
            {
                nickname : 'parkwongyun',
                message : inputEl.value
            }
        ))
        inputEl.value = ''
    })

    socket.addEventListener('message',(event) => {
        chatlistEl.innerHTML=''

        chats.push(JSON.parse(event.data));
        chats.forEach( ({message,nickname}) => {
            const div = document.createElement('div')
            div.innerText=`${nickname} : ${message}`;
            chatlistEl.appendChild(div);
        })

    })
})()