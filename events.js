module.exports = {
	onCanto: function(userIndex, canto){
		this.trigger('canto', userIndex, canto);
	},
	onCaida: function(userIndex, valor){	
		this.onPoints(userIndex, valor, 'caida');
		this.addPoints(userIndex, valor);
		this.trigger('caida', userIndex, valor);
	},
	onClear: function(){
		this.onPoints(this.gameData.dealer, 4, 'clear');
		this.addPoints(this.gameData.turn, 4);
		this.trigger('mesalimpia');
	},
	onUltimas: function(){
		this.trigger('ultimas');
	},
	onPoints: function(userIndex, valor, reason){
		let player = this.players[userIndex];
		let message;
		switch(reason){
			case "canto":
				message = "%u sumó %p por canto.";
			break;
			case "caida":
				message = "%u dió caida de %p.";
			break;
			case "clear":
				message = "%u hizo mesa limpia.";
			break;
			case "count":
				message = "%u sumó %p por cartas.";
			break;
			case "guess":
				message = "%u pegó %p.";
			break;
			case "noguess":
				message = "%u obtuvo %p de malhechada.";
			break;
			default:
				message = "%u recibió %p.";
			break;
		}
		message = message.replace("%u", player.userName);
		message = message.replace("%p", (valor == 1 ? "1 punto" : valor + " puntos"));
		this.trigger('points', valor, reason);
	},
	onStatusChange: function(){
		this.trigger('statusChange');
	},
	onCanChange: function(){
		this.onStatusChange();
	},
	onTable: function(first){
		this.trigger('firstCard', first);
	},
	onCardByUser(card){
		this.trigger('cardPlacedByUser', card);
	}
	trigger(callback, ...args){
		console.log(callback, args);
	}
}