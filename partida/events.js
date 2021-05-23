module.exports = {
	eventHandlers: [],
	onCanto: function(userIndex, canto){
		this.trigger('canto', userIndex, canto);
	},
	onCaida: function(userIndex, valor){	
		this.trigger('caida', userIndex, valor);
		this.onPoints(userIndex, valor, 'caida');
		this.addPoints(userIndex, valor);
	},
	onClear: function(){
		this.trigger('mesalimpia');
		this.onPoints(this.gameData.dealer, 4, 'clear');
		this.addPoints(this.gameData.turn, 4);
	},
	onUltimas: function(){
		this.trigger('ultimas');
	},
	onPoints: function(userIndex, valor, reason){
		this.trigger('points', userIndex, valor, reason);
	},
	onStatusChange: function(newStatus = false){
		this.trigger('statusChange', newStatus);
	},
	onCanChange: function(){
		if(this.gameData.canDeal)
			this.trigger('canDeal');
		if(this.gameData.canTable)
			this.trigger('canTable');
	},
	onTable: function(first){
		this.trigger('firstCard', first);
	},
	on: function(event, func){
		if(typeof func === 'function')
			this.eventHandlers[ event ] = func;
	},
	trigger: function(callback, ...args){
		if(this.eventHandlers[callback] && typeof this.eventHandlers[callback] === 'function'){
			this.eventHandlers[callback](...args);
		} else {
			console.log('\x1b[34m', callback, '\x1b[0m');

		}
	}
}