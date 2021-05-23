class Room{
	constructor(){
		this.partida = false;
		this.chairs = [{}, {}, {}, {}];
	}
	getChairs(){
		let response = {};
		this.chairs.forEach((person, key) => {
			response[ (key+1) ] = person.userName || 'Vacía';
		});
		return response;
	}
	sit(person, key){
		if(this.partida) return -1;
		if( this.chairs[ key ].userId )
			return false;
		this.chairs[ key ] = person;
		return true;
	}
	addBot(key){
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
		let key = this.chairs.find(single => single.userId==person.userId);
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
		this.partida = new P({
			players: this.getPlayers(),
			config:{
				slots: this.getPlayers().length,
				team
			}
		});
		return this.partida;
	}

	getPlayers(){
		return this.chairs.filter(x => typeof x.userId !== 'undefined');
	}
}
module.exports = Room;