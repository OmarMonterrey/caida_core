module.exports = {
	addPoints: function(index,value){
		let tempPoints;
		this.gameData.points[index] += value;
		if(!this.config.team)
			tempPoints = [...this.gameData.points];
		else{
			tempPoints = [(this.gameData.points[0]+this.gameData.points[2]),(this.gameData.points[1]+this.gameData.points[3])];
		}
		let winnerIndex = tempPoints.findIndex((i)=>{return i>=24});
		if(winnerIndex!==-1){
			this.gameData.status = 'ended';
			this.wonGame(winnerIndex);
		}
		this.trigger('pointCount', this.getPoints());
	},
	cardValue: function(card){
		return (card + 1) - (Math.floor(card / 10) * 10);
	},
	getPoints: function(){
		let response = {};
		if(this.config.team){
			let team1 = this.players[0].userName + ' & ' + this.players[2].userName;
			let team2 = this.players[1].userName + ' & ' + this.players[3].userName;
			response[team1] = this.gameData.points[0] + this.gameData.points[2];
			response[team2] = this.gameData.points[1] + this.gameData.points[3];
		} else {
			this.players.forEach(function(singlePlayer, key){
				response[singlePlayer.userName] = this.gameData.points[key];
			}.bind(this));
		}
		return response;
	}
}