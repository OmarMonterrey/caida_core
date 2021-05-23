module.exports = {
	gameCreated: function(){
		this.trigger("gameCreated");
		this.checkBotPlay();
	},
	gameStarted: function(){
		if(
			this.gameData.canDeal
				||
			this.gameData.canTable
				||
			this.gameData.table.length != 4
				||
			this.gameData.hands.some((singleHand) =>{return singleHand.length===0})
		)
			return false;
		this.gameData.status = 'playing';
		this.gameData.turn = (this.gameData.dealer+1)===this.gameData.players.length ? 0 : this.gameData.dealer+1;
		this.gameData.status='playing';
		this.gameData.lastCardPlaced = false;
		let data = {};
		data.gameData = this.currentData();
		this.trigger('gameStarted');
		this.updateHands();
		this.checkBotPlay();
	},
	cardPlayed: function(card){
		let data = {
			cardPlayed: card,
			table:this.gameData.table,
			canDeal: this.gameData.canDeal,
			canTable: this.gameData.canTable
		}
		this.trigger('cardPlayed', data);
	},
	wonGame: function(index){
		this.trigger('win', index);
	},
	updateHands: function(){
		this.trigger('handCount', this.handCount());
	}
}