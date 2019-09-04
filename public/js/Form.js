var socket = io("http://localhost:3000");
var messageCount = 0
function renderMessage(message, newMessage = true) {
	messageCount++

	let newMessageClass = newMessage ? 'new-message' : ''
	$(".messages").append(
		`<div id="message-${messageCount}" class="message ${newMessageClass}">
			<strong>${message.author}</strong>: ${message.message}
		</div>` );
	
	setTimeout(() => {
		$(`#message-${messageCount}`).removeClass('new-message')
	}, 7*1000);
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

  let author = $("input[name=username]").val();
  let message = $("input[name=message]").val();

  if (author.length > 0 && message.length > 0) {
    let messageObject = { author, message };

    renderMessage(messageObject);
    socket.emit("sendMessage", messageObject);
    $("#input-message").val("");
  }
});
