const Crypto = require('crypto');

const CertChain = function() {
	let chain = [];
	let currentBlock = {};
	let genesisBlock = {};

	function init(){
		genesisBlock = { 
        index: 0
		  , timestamp: 1511818270000
		  , data: [
			{	
				certificateID:0,
				name: 'naveen',
				dob: '27-10-1998',
				PIN: '16L35A0511',
				dateOfIssue: '10-04-2019',
				marks:[
					{cloudComputing: 80},
					{managementScience: 80},
					{humanComputerInteraction:80},
					{distributedSystems:80}
				],
				hash: 'thisisademohashforgenesisblock',
				previousHash: -1
			},
			{
				certificateID:1,
				name: 'hemalatha',
				dob: '27-10-1998',
				PIN: '15L31A05L4',
				dateOfIssue: '10-04-2019',
				marks:[
					{loudComputing: 80},
					{managementScience: 80},
					{humanComputerInteraction:80},
					{distributedSystems:80}
				]
			},
			{
				certificateID:2,
				name: 'nookesh',
				dob: '27-10-1998',
				PIN: '16L35A0512',
				dateOfIssue: '10-04-2019',
				marks:[
					{loudComputing: 80},
					{managementScience: 80},
					{humanComputerInteraction:80},
					{distributedSystems:80}
				]
			},
			{
				certificateID:3,
				name: 'chinnikrishna',
				dob: '27-10-1998',
				PIN: '15L31A05K2',
				dateOfIssue: '10-04-2019',
				marks:[
					{loudComputing: 80},
					{managementScience: 80},
					{humanComputerInteraction:80},
					{distributedSystems:80}
				]
			}]
		  , previousHash: "-1"
		  , nonce: 0
		};

		genesisBlock.hash = createHash(genesisBlock);
		for(var i=1;i<genesisBlock.data.length;i++){
			genesisBlock.data[i].hash = Crypto.createHash('SHA256').update(genesisBlock.data[i].name+genesisBlock.data[i].dob+genesisBlock.data[i].certificateID+genesisBlock.data[i].dateOfIssue+genesisBlock.data[i].PIN+genesisBlock.data[i].marks).digest('hex');
			genesisBlock.data[i].previousHash = genesisBlock.data[i-1].hash;
		}
		chain.push(genesisBlock);
		currentBlock = genesisBlock; 
	}

	function createHash({ timestamp, data, index, previousHash, nonce }) {
		return Crypto.createHash('SHA256').update(timestamp+data+index+previousHash+nonce).digest('hex');
	}

	function addToChain(block){

		if(checkNewBlockIsValid(block, currentBlock)){
			chain.push(block);
			currentBlock = block; 
			console.log(JSON.stringify(chain,null, '\t'));
			return true;
		}
		
		return false;
	}

	function createBlock(certificatesData){
		let newBlock = {
			  index: currentBlock.index+1
			, timestamp: new Date().getTime()
			, data: certificatesData
		  , index: currentBlock.index+1
		  , previousHash: currentBlock.hash
		  , nonce: 0
		};

		//newBlock.data = datahandler(certificatesData);
		//console.log(certificatesData.subjects[0][0]);
		newBlock = proofOfWork(newBlock);
	
		return newBlock;
	}
	//cenverting block to necessary format
function datahandler(response){
	var modifiedData = [];
	var certObject ={};
	var data = response;
	for(var k=0; k<data.name.length; k++){
		var certLength = data.name.length;
		certObject.certificateID = k;
		certObject.name = data.name[k];
		certObject.dob = data.dateofbirth[k];
		certObject.PIN = data.pin[k];
		certObject.dateOfIssue = data.doi[k];
		certObject.marks = [];
		for(var j=0;j<5;j++){
			var markObject = {};
			var f = 0;
			if(f<certLength){
			markObject
			.data.subjects[j][f] = data.marks[j][f];
			certObject.marks.push(markObject);
			}
			f++;
		}
		
		modifiedData[k].push({
			certObject
		}
		);
		
	}
	return modifiedData;
}
	function proofOfWork(block){

		while(true){
			block.hash = createHash(block);
			if(block.hash.slice(-4) === "0000"){	
				return block;
			}else{
				block.nonce++;
			}
		}
	}

	function getLatestBlock(){
		return currentBlock;
	}

	function getTotalBlocks(){
		return chain.length;
	}

	function getChain(){
		return chain;
	}

	function replaceChain(newChain){
		chain = newChain;
		currentBlock = chain[chain.length-1];
	}

	function checkNewBlockIsValid(block, previousBlock){
		if(previousBlock.index + 1 !== block.index){
			//Invalid index
			return false;
		}else if (previousBlock.hash !== block.previousHash){
			//The previous hash is incorrect
			return false;
		}else if(!hashIsValid(block)){
			//The hash isn't correct
			return false;
		}
		
		return true;
	}	

	function hashIsValid(block){
		return (createHash(block) == block.hash);
	}

	function checkNewChainIsValid(newChain){
		//Is the first block the genesis block?
		if(createHash(newChain[0]) !== genesisBlock.hash ){
			return false;
		}

		let previousBlock = newChain[0];
		let blockIndex = 1;

        while(blockIndex < newChain.length){
        	let block = newChain[blockIndex];

        	if(block.previousHash !== createHash(previousBlock)){
        		return false;
        	}

        	if(block.hash.slice(-3) !== "000"){	
        		return false;
        	}

        	previousBlock = block;
        	blockIndex++;
        }

        return true;
	}

	return {
		init,
		createBlock,
		addToChain,
		checkNewBlockIsValid,
		getLatestBlock,
		getTotalBlocks,
		getChain,
		checkNewChainIsValid,
		replaceChain
	};
};

module.exports = CertChain;