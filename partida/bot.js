module.exports = {
	generateName: function(){
		let botNames = [
			'Botsito',
			'R2D2',
			'C3PO',
			'Terminator',
			'Jarvis',
			'Iron Man',
			'Mark 1',
			'Yo-robot',
			'Blitzcrank'
		];
		if(!this.players)
			this.players = [];
		while(true){
			response = botNames[Math.floor(Math.random() * botNames.length)];
			inUse = this.players.findIndex(function(singlePlayer){
				if(singlePlayer.isBot && singlePlayer.userName==response)
					return true;
			});
			if(inUse==-1)
				return response;
		}
	},
	singleBot: function(id=false,name=false,append=false){
		if(id===false)
			id = Math.ceil(Math.random()*1000000000)
		if(!name)
			name = this.generateName();
		if(append)
			name = name + '_' + append;
		return {
			userId:id,
			userName:name,
			isAdmin:false,
			isBot:true
		};
	},
	createBots: function(slots){
		var bots = ['A','B','C','D'];
		var r = [];
		for(let i=0;i<slots;i++)
			r.push(this.singleBot(bots[i]))
		return r;
	},
	autoPlay: function(){
		if(this.gameData.status!=='playing')
			return false;
		let hand = [...this.gameData.hands[this.gameData.turn]];
		let cardToPlay = hand.shift();
		return this.play(cardToPlay);
	},
	checkBotPlay(){
		if(this.gameData.status=='dealing' && this.isBot(this.gameData.dealer)){
			setTimeout(function(){
				this.table();
				this.deal();
			}.bind(this), this.botDealTime);
			return true;
		} 
		if(this.gameData.status=='playing' && this.isBot(this.gameData.turn)){
			setTimeout(function(){
				this.autoPlay();
			}.bind(this), this.botPlayTime);
			return true;
		}
	},
	isBot(userIndex=false){
		if(userIndex===false)
			return false;
		return !!(this.gameData.players[userIndex] && this.gameData.players[userIndex].isBot);
	},
	checkIfBots(){
		this.players = this.players.map(function(singlePlayer, key){
			if(!singlePlayer || singlePlayer.userId!=='B')
				return singlePlayer;
			else
				return this.singleBot(false,false,key);
		}.bind(this));
	}
}