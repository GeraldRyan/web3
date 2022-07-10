const crpytoHash = require("./cryptoHash");

const INIT_DIFFICULTY = 2;
const MINE_RATE = 1000;
const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '--',
    hash: 'genesis-hash',
    difficulty: INIT_DIFFICULTY,
    nonce: 0,
    data: []
}

class Block{
    constructor({timestamp, lastHash, hash, data, nonce, difficulty}){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty

    }

    static genesisBlock(){
        return new this(GENESIS_DATA)
    }

    static mineBlock(lastBlock, data){
        let timestamp = Date.now()
        let lastHash = lastBlock.hash;
        let {difficulty} = lastBlock
        let nonce = 0;
        let hash = ''

        do{
            nonce++;
            timestamp = Date.now()
            difficulty = Block.changeDifficulty({originalBlock: lastBlock, timestamp})
            hash = crpytoHash(timestamp, lastHash, data, nonce, difficulty)
        }
        while(hash.substring(0, difficulty) !== '0'.repeat(difficulty))
        return new this({timestamp, lastHash, hash, data, nonce, difficulty})
    }

    static changeDifficulty({originalBlock, timestamp}){
        const {difficulty} = originalBlock;
        const difference = timestamp - originalBlock.timestamp
        if (difference > MINE_RATE){
            return difficulty -1
        }
        return difficulty + 1
    }
}

module.exports = Block;