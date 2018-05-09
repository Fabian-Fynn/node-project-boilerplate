/* global socket */

$('.chat-Textarea-input').keyup(function sendMessage(ev) {
  const code = ev.keyCode || ev.which;
  if (code === 13) {
    const user = {
      uid: localStorage.getItem('uid'),
      name: localStorage.getItem('username'),
    };

    const time = moment().format('LT');

    socket.emit('send-message', { text: $(this).val(), user, time });
    $(this).val('');
  }
});

socket.on('receive-message', (msg) => {
  const msgClass = (msg.user.uid === getUser().uid) ? 'chat-Message-content_own' : 'chat-Message-content';
  $('.chat-Messages').append(`<div class='chat-Message'><div class=${msgClass}><p class="chat-username">${msg.user.name}</p> ${msg.text}<p class="chat-Message-time">${msg.time}</p></div></div>`);
  $('.chat-Messages').scrollTop($('.chat-Messages')[0].scrollHeight);
});
