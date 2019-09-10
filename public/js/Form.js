var socket = io("http://localhost:3000");
var messageCount = 0
var author
var message

function renderMessage(message, newMessage = true) {
	messageCount++

  let newMessageClass = newMessage ? 'new-message' : ''
  let isYou = author == message.author ? 'is-you' : ''
  console.log(author, message.author);
  
  let htmlMessage = `
  <div id="message-${messageCount}" class="message-container ${newMessageClass} ${isYou}">
    <div class="message">`
    if(!isYou) {
      htmlMessage += `
      <div class="title">${message.author}:</div>`;
    }
    htmlMessage += `
      <div>${message.message}</div>
      <div class="time">${message.time}</div>
    </div>
  </div>`;
	$(".messages").append(htmlMessage);
	
	setTimeout(() => {
		$(`#message-${messageCount}`).removeClass('new-message')
  }, 7*1000);
  
  $(".messages").prop("scrollTop", $(".messages").prop("scrollHeight"));
}

socket.on("previousMessages", messages => {
  for (message of messages) {
    renderMessage(message, false);
  }
});

socket.on("receivedMessage", message => {
  renderMessage(message);
});

$("#chat").submit(event => {
  event.preventDefault();

  author = $("input[name=username]").val();
  message = $("input[name=message]").val();

  if (author.length > 0 && message.length > 0) {
    let messageObject = { author, message, time: new Date().toLocaleString() };

    renderMessage(messageObject);
    socket.emit("sendMessage", messageObject);
    $("#input-message").val("");
  }
});

$("#btn-login").click(e => {
  if ($("input[name=username]").val().length > 0) {
        document.querySelector('#enter').style.display = 'none'
        document.querySelector('#chat').style.visibility = 'visible'
      }
})
