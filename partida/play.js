module.exports = {
	play: function (card){
		if(this.gameData.status!=='playing')
			return;
		cardIndex  = this.handIndex(card);
		if(cardIndex===-1)
			return false;

		
		this.checkCanto();
		this.handTake(cardIndex);
		let r = this.placeCard(card);
		this.processPlay(r);

		this.gameData.turn = (this.gameData.turn+1)===this.gameData.players.length ? 0 : this.gameData.turn+1;
		this.updateHands();
		if(this.needDeal()){
			this.checkCantoPoints();
			if(this.gameData.deck.length){
				this.deal(true);
				this.checkBotPlay();
			} else {
				setTimeout(function(){
					this.countCards();
				}.bind(this),this.waitTime);
			}
		} else {
			this.checkBotPlay();
		}
		return r;
	},
	processPlay: function(r){
		if(r.took){
			this.gameData.pile[this.gameData.turn]+=r.tookCount;
			if(!this.gameData.table.length && this.gameData.deck.length){
				this.onClear();
			}
		}
		if(r.caida){
			this.onCaida(this.gameData.turn,(r.value < 8 ? 1 : r.value-6), 'caida');
		}
	},
	checkCanto: function(userHand=false){
		if(userHand===false)
			var userHand = this.gameData.hands[this.gameData.turn];
		if(!userHand.length || userHand.length!=3)
			return false;
		let canto = this.cantoList(userHand);
		if(canto){
			this.gameData.cantos[this.gameData.turn] = canto;
			this.onCanto(this.gameData.turn, canto);
			return true;
		}
		return false;
	},
	cantoList: function(userHand){
		let cardValues = userHand.map((i)=>{return this.cardValue(i)});
		let totalSum = cardValues.reduce((i,ii)=>{return i+ii;});
		cardValues = cardValues.sort((a, b) => a-b);
		if(cardValues.includes(1) && cardValues.includes(9) && cardValues.includes(10)){
			return {totalSum:totalSum,name:'Registro',value:8};
		}
		let cardSet = new Set(cardValues);
		if(cardSet.size < cardValues.length){
			// Duplied element found
			let duplied = false;
			let remain = false;
			let saw = [];
			cardValues.forEach(function(i){
				if(saw.includes(i))
					duplied = i;
				else
					saw.push(i);
			});
			cardSet.delete(duplied);
			if(!cardSet.size)
				return {totalSum:totalSum,name:'Trivilín',value:30};
			remain = cardSet.values().next().value;
			if(duplied===10 && remain===1)
				return {totalSum:totalSum,name:'Casa grande',value:12};
			else if(Math.abs(duplied-remain)===1)
				return {totalSum:totalSum,name:'Vigia',value:7};
			else
				return {totalSum:totalSum,name:'Ronda',value:(duplied<8?1:duplied-6)};
		}
		let temp = false, patrulla = false;
		n1 = cardValues.shift();
		n2 = cardValues.shift();
		n3 = cardValues.shift();
		if(n1===n2-1 && n2===n3-1)
			return {totalSum:totalSum,name:'Patrulla',value:6};
		return false;
	},
	checkCantoPoints: function(){
		let values = [...new Array(this.players.length)].map(()=> 0);
		let sums = [...new Array(this.players.length)].map(()=> 0);
		this.gameData.cantos.forEach((singleCanto,i)=>{
			if(!singleCanto.value || !singleCanto.totalSum)
				return;
			values[i] = singleCanto.value;
			sums[i] = singleCanto.totalSum;
		});
		if(values.filter((i)=>{return i===0}).length === this.players.length){
			return;
		}
		let maxValue = Math.max(...values);
		let validValues = values.map((i)=>{return i!=maxValue ? 0 : i});
		let validSums = sums.map((i,ii)=>{return validValues[ii]==0 ? 0 : i});
		let maxSum = Math.max(...validSums);
		let validWinner = false;
		if(validValues.filter((i)=>{return i===maxValue}).length===1){
			/// Sólo una persona cantó
			validWinner = validValues.indexOf(maxValue);
		} else if(validSums.filter((i)=>{return i===maxSum}).length===1){
			/// Varias personas cantaron pero ganó el mayor
			validWinner = validSums.indexOf(maxSum);
		} else {
			/// Varias personas cantaron, gana quien sea mano.
			let dealer = this.gameData.dealer;
			let hand = dealer+1;
			let validWinner = false;
			while(validWinner===false){
				if(validValues[hand]!==0)
					validWinner = hand;
				else
					hand = (hand+1)===this.gameData.players.length ? 0 : hand+1;
			}
		}
		this.onPoints(validWinner,maxValue,'canto');
		this.addPoints(validWinner,maxValue);
		
	}
}