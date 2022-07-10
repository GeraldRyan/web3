const crpytoHash = require("./cryptoHash");

const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '--',
    hash: 'genesis-hash',
    data: []
}

class Block{
    constructor({timestamp, lastHash, hash, data}){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;

    }

    static genesisBlock(){
        return new this(GENESIS_DATA)
    }

    static mineBlock(lastBlock, data){
        let timestamp = Date.now()
        let lastHash = lastBlock.hash;
        let hash = crpytoHash(timestamp, lastHash, data)
        return new this({timestamp, lastHash, hash, data})
    }
}

module.exports = Block;