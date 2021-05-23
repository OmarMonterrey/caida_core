module.exports = {
	countCards: function(){
		if(this.gameData.status!=='playing')
			return false;
		this.gameData.status = 'cardCount';
		this.gameData.pile[this.gameData.lastTook]+=this.gameData.table.length;
		this.gameData.table = [];
		let needed;
		if(this.config.team){
			needed = 20;
			this.gameData.pile[0]+=this.gameData.pile[2];
			this.gameData.pile[1]+=this.gameData.pile[3];
			this.gameData.pile[2] = 0;
			this.gameData.pile[3] = 0;
		} else {
			needed = Math.floor(40/this.gameData.players.length);
		}
		this.gameData.pile.forEach(function(singlePile,index){
			if(this.gameData.dealer===index && this.gameData.players.length===3)
				singlePile--;
			if(singlePile > needed){
				let won = singlePile-needed;
				this.onPoints(index, won, 'count');
				this.addPoints(index,won);
				setTimeout(function(){
					this.changeDealer();
				}.bind(this),this.countTime);
			}
		}.bind(this));
		this.trigger('cardsCounted');
	},
	changeDealer: function(){
		if(this.gameData.deck.length || this.gameData.status!=='cardCount')
			return false;
		this.gameData.deck = [...Array(40).keys()].sort(() => 0.5 - Math.random());
		this.gameData.pile = [...new Array(this.players.length)].map(()=> 0);
		this.gameData.hands = [...new Array(this.players.length)].map(()=> []);
		this.gameData.dealer = (this.gameData.dealer+1)===this.gameData.players.length ? 0 : this.gameData.dealer+1;
		this.gameData.turn = (this.gameData.dealer+1)===this.gameData.players.length ? 0 : this.gameData.dealer+1;
		this.gameData.canDeal = true;
		this.gameData.canTable = true;
		this.gameData.status = 'dealing';
		this.checkBotPlay();
		this.onStatusChange('dealing');
	}
}