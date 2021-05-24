module.exports = {
	placeCard: function(card, forcePos=false){
		let tookCount = 0;
		let cardValue = this.cardValue(card);
		let valuesInTable = this.valuesInTable();
		let took = valuesInTable.includes(cardValue);
		let caida = this.cardValue(card)===this.gameData.lastCardPlaced;
		let cardData = {
			id:card,
			position:this.tablePosition(forcePos),
			rotation: 10 - Math.random()*20,
			value:cardValue,
			turn: this.gameData.turn,
			next: (this.gameData.turn+1)===this.gameData.players.length ? 0 : this.gameData.turn+1
		};
		if(this.gameData.status==='dealing' || !took){
			this.gameData.table.push(cardData);
			this.gameData.lastCardPlaced = cardValue;
		} else {
			this.gameData.lastCardPlaced = false;
			this.gameData.lastTook = this.gameData.turn;
			tookCount=1;
			let fakeValue = cardValue;
			while(valuesInTable.includes(fakeValue)){
				let cardIndex = this.gameData.table.findIndex((singleCard)=>{
					if(!singleCard)
						return;
					return this.cardValue(singleCard.id)==fakeValue
				});
				this.gameData.table.splice(cardIndex,1);
				tookCount++;
				fakeValue++;
			}
		}
		var r = {
			id:card,
			value:cardValue,
			took:took,
			caida:caida,
			tookCount:tookCount
		};
		if(this.gameData.status === 'playing'){
			this.cardPlayed(cardData);
		}
		return r;
	},
	valuesInTable: function(){
		let r = [];
		this.gameData.table.forEach(function(singleCard){
			r.push(this.cardValue(singleCard.id));
		}.bind(this));
		return r;
	},
	tablePosition: function(forcePos=false){
		let took = [];
		this.gameData.table.forEach(function(singleCard){
			took.push(singleCard.position);
		}.bind(this));
		let r = false;
		if(forcePos!==false && !took.includes(forcePos))
			return forcePos;
		if(took.length>=9)
			return 1+Math.round(Math.random()*8);
		while( (r===false || took.includes(r)) )
			r = 1+Math.round(Math.random()*8);
		return r;
	},
	table: function(first=1,placed=0){
		if(this.gameData.status!='dealing'
				||
			(!this.gameData.canTable && !placed)
				||
			(this.gameData.table.length>=4 && placed!=4)
		)
			return false;
		let guess = first===1 ? first+placed : first-placed;
		if(placed===0)
			this.onTable(first);
		if(placed<4){
			let position;
			switch(placed){
				case 0:position=1;break;
				case 1:position=3;break;
				case 2:position=7;break;
				case 3:position=9;break;
			}
			let Threw = this.placeCard(this.gameData.deck.shift(), position);
			this.trigger('tableCardPlaced', Threw.id, guess);
			if(Threw.took){
				this.trigger('cardRepeated');
				placed--;
				this.gameData.table.pop();
				this.gameData.deck.push(Threw.id);
			} else {
				if(Threw.value===guess){
					this.onPoints(this.gameData.dealer,guess,'guess');
					this.addPoints(this.gameData.dealer,guess);
				}
			}
			setTimeout(()=>this.table(first,placed+1), this.placeTime);
		} else {
			this.gameStarted();
		}
		if(this.gameData.canTable){
			this.gameData.canTable = false;
			this.onCanChange();
			this.gameData.malhechada = true;
		}
		return true;
	},
	deal: function(force=false){

		if( !['dealing','playing'].includes(this.gameData.status)
				||
			(!this.gameData.canDeal && !force)
				||
			this.gameData.hands.some((singleHand) =>{return singleHand.length!==0})
		)
			return false;
		this.trigger('dealt');
		var cardsToDeal = this.config.slots*3;
		for(let i=0;i<cardsToDeal;i++){
			let handIndex = Math.floor(i/3);
			this.gameData.hands[handIndex].push( this.gameData.deck.shift() );
		}
		this.gameData.canDeal = false;
		this.gameData.lastCardPlaced = false;
		this.gameData.cantos = [...new Array(this.players.length)].map(()=> []);
		this.updateHands();
		this.onCanChange();
		if(!force)
			this.gameStarted();
		if(!this.gameData.deck.length)
			this.onUltimas();
		return true;
	}
}