
(function(){

	if(!window.WebSocket) return;
	var logged = false;

	var nameImput = document.getElementById("nickName");
	var logInButton = document.getElementById("login");
	var messageImput = document.getElementById("sendText");
	var sendButton = document.getElementById("sendButton");
	var chatDiv = document.getElementById("chatRoom");
	

	var socket = new WebSocket("ws://localhost:8000");
	socket.onmessage = function(e){
		displayMessage(e);
	};
	socket.onclose = function(){
		chatDiv.innerHTML = "<h2 class='allert'>Brak połączenia z serwerem!</h2>";
		logInButton.setAttribute("disabled", "disabled");
		nameImput.setAttribute("readonly", "readonly");
	};
	
	logInButton.onclick = function(){
		logIn();
	};

	
	function logIn (){
		var userName = nameImput.value;
		
		if(userName !== "" && !logged){
			sendData({
				type: "join",
				name: userName
			});
			
			logInButton.setAttribute("disabled", "disabled");
			nameImput.setAttribute("readonly", "readonly");
			sendButton.removeAttribute("disabled");
			sendButton.onclick = sendMessage;
			logged = true;
		}else{
			return;
		}
	}
	
	function sendMessage() {
		var message = messageImput.value;
		
		if(message !== "" && logged){
			sendData({
				type: "message",
				message: message,
			});
			messageImput.value = "";
		}else{
			console.log("pusto");
		}
	}
	
	function sendData(obj){
		var objJson = JSON.stringify(obj);
		
		socket.send(objJson);
	}
	
	function displayMessage(e){
		var messageObj = JSON.parse(e.data);
		var row = document.createElement("p");
		row.classList.add("logs");
		var innerRow;
		
		if(messageObj.type === "join"){
			innerRow = "<span class='log-text'>" + messageObj.message + "</span>";
		}else if(messageObj.type === "message"){
			innerRow = "<span class='message-name'>" + messageObj.name + ": </span>" + "<span class='message-text'>" + messageObj.message + "</span>";
		}
		
		row.innerHTML = innerRow;
		chatDiv.appendChild(row);
	}
})();