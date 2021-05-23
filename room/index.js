class Room{
	constructor(name = false){
		this.partida = false;
		this.chairs = [{}, {}, {}, {}];
		this.name = name;
	}
	getChairs(){
		let response = {};
		this.chairs.forEach((person, key) => {
			response[ (key+1) ] = person.userName || 'Vacía';
		});
		return response;
	}
	sit(person, key=false){
		if(this.partida) return -1;
		if(person.userId !== 'B' && this.chairs.findIndex(x => x.userId==person.userId)>=0) return -1;
		if(key===false) key = this.sitKey();
		if( this.chairs[ key ].userId )
			return false;
		this.chairs[ key ] = person;
		return true;
	}
	sitKey(){
		let emptyChair = this.chairs.findIndex(x => typeof x.userId === 'undefined');
		return emptyChair;
	}
	addBot(key=false){
		return this.sit({userId:'B', userName:'BOT'}, key)
	}
	kick(key){
		if(this.partida) return -1;
		if( !this.chairs[ key ].userId )
			return false;
		this.chairs[ key ] = {};
		return true;
	}
	stand(person){
		if(this.partida) return -1;
		let key = this.chairs.findIndex(single => single.userId==person.userId);
		if(key == -1)
			return false;
		this.chairs[ key ] = {};
		return true;
	}
	stop(){
		this.partida = false;
	}
	start(P, team=false){
		if(this.partida) return -1;
		if(this.getPlayers().length < 2) return -1;
		this.partida = new P({
			players: this.getPlayers(),
			config:{
				slots: this.getPlayers().length,
				team
			}
		});
		return true;
	}

	getPlayers(){
		return this.chairs.filter(x => typeof x.userId !== 'undefined');
	}
}
module.exports = Room;