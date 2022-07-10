const crpytoHash = require("./cryptoHash");

const INIT_DIFFICULTY = 2;
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
        const {difficulty} = lastBlock
        let nonce = 0;
        let hash = ''

        do{
            nonce++;
            timestamp = Date.now()
            hash = crpytoHash(timestamp, lastHash, data, nonce, difficulty)
        }
        while(hash.substring(0, difficulty) !== '0'.repeat(difficulty))
        return new this({timestamp, lastHash, hash, data, nonce, difficulty})
    }
}

module.exports = Block;