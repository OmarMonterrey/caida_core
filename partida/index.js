var botFunctions = require('./bot.js');
var tableFunctions = require('./table.js');
var playFunctions = require('./play.js');
var statusFunctions = require('./status.js');
var hooksFunctions = require('./hooks.js');
var pointsFunctions = require('./points.js');
var events = require('./events.js');
var handFunctions = require('./hand.js');
class Partida{
	constructor(options={}){
		this.blankData = this.blankData.bind(this);

		this.players = options.players || this.createBots(options.config.slots);
		this.checkIfBots();
		this.config = options.config;

		this.gameData = options.gameData ? options.gameData : this.blankData();

		this.waitTime = 1//1000;
		this.botPlayTime = 1//2000;
		this.botDealTime = 1//2000;
		this.countTime = 1//300;
		this.placeTime = 1//1000;
		this.pointsNeeded = 5//24;

		this.gameCreated();
	}
	blankData(){
		return {
			status:'dealing',
			deck:[...Array(40).keys()].sort(() => 0.5 - Math.random()),
			players:this.players,
			dealer:Math.floor(Math.random() * this.players.length),
			turn:false,
			points:[...new Array(this.players.length)].map(()=> 0),
			pile:[...new Array(this.players.length)].map(()=> 0),
			hands:[...new Array(this.players.length)].map(()=> []),
			cantos:[...new Array(this.players.length)].map(()=> []),
			table:[],
			canDeal:true,
			canTable:true,
			lastCardPlaced:false,
			lastTook:false,
			malhechada:false
		};
	}
	checkTurn(userId,dealing=false){
		var userIndex = this.players.findIndex(singlePlayer => {
			if(!singlePlayer)
				return false;
			return singlePlayer.userId === userId;
		});
		return dealing ? userIndex===this.gameData.dealer : userIndex===this.gameData.turn;
	}
	getHand(userId){
		var userIndex = this.players.findIndex(singlePlayer => {
			if(!singlePlayer)
				return false;
			return singlePlayer.userId === userId;
		});
		if(userIndex===-1)
			return [];
		return this.gameData.hands[userIndex];
	}
	selfIndex(userId){
		var userIndex = this.players.findIndex(singlePlayer => {
			if(!singlePlayer)
				return false;
			return singlePlayer.userId === userId;
		});
		return userIndex;
	}
	handCount(){
		return this.gameData.hands.map(function(hand, i){return hand.length;})
	}
	currentData(){
		let users = [];
		this.gameData.players.forEach(function(singleUser,i){
			users.push({
				userId:singleUser.userId,
				userName:singleUser.userName,
				isAdmin:singleUser.isAdmin,
				isBot:singleUser.isBot,
				isDealer:this.gameData.dealer===i,
				isTurn:this.gameData.turn===i
			});
		}.bind(this));
		let data = {
			status: this.gameData.status,
			users:users,
			table:this.gameData.table,
			points:this.getPoints(),
			canDeal:this.gameData.canDeal,
			canTable:this.gameData.canTable
		};
		return data;
	}
}
Object.assign(Partida.prototype, botFunctions);
Object.assign(Partida.prototype, tableFunctions);
Object.assign(Partida.prototype, playFunctions);
Object.assign(Partida.prototype, statusFunctions);
Object.assign(Partida.prototype, hooksFunctions);
Object.assign(Partida.prototype, pointsFunctions);
Object.assign(Partida.prototype, handFunctions);
Object.assign(Partida.prototype, events);
module.exports = Partida;