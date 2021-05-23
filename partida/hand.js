module.exports = {
	handIndex: function(card, userIndex=false){
		if(userIndex===false)
			userIndex = this.gameData.turn;
		let userHand = this.gameData.hands[userIndex];
		if(!userHand)
			return -1;
		return userHand.indexOf(card);
	},
	handTake: function(cardIndex, userIndex=false){
		if(userIndex===false)
			userIndex = this.gameData.turn;
		if(!this.gameData.hands[userIndex] || typeof this.gameData.hands[userIndex][cardIndex] === 'undefined')
			return;
		this.gameData.hands[userIndex].splice(cardIndex, 1);
	},
	needDeal: function(){
		return !this.gameData.hands.some((singleHand)=>{return singleHand.length});
	}
}