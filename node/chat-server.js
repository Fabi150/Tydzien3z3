var ws = require("nodejs-websocket");
var server = ws.createServer(function(conn){
	console.log("Nowy klient podlaczony.");
	conn.on("text", function(data){
		var dataObject = JSON.parse(data);
		
		if(dataObject.type == "join"){
			conn.nickName=dataObject.name;
			console.log(conn.nickName + " dołączył do czatu:")
			
			sendToAll({
				type: "join",
				message: conn.nickName + " dołączył/a do czatu."
			});
		}else if(dataObject.type == "message"){
			sendToAll({
				type: "message",
				name: conn.nickName,
				message: dataObject.message
			});
		};
	});
	
	conn.on("close", function(){
		if(conn.nickName){
			sendToAll({
				type: "join",
				message: conn.nickName + " opuścił/a czat."
			});
			console.log(conn.nickName + " opuścił/a czat.");
		};
	});
	
	conn.on("error", function(){
		console.log("Nieoczekiwanie przerwano połączenie");
	})
	
}).listen(8000, "localhost", function(){
	console.log("server aktywny");
});

function sendToAll(data) {
	var msg = JSON.stringify(data);
	
	server.connections.forEach(function(conn){
		conn.sendText(msg);
	});
}