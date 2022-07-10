const Block = require('./block')
const cryptoHash = require('./cryptoHash')

const MINE_RATE = 1000;

describe("Block", ()=>{
    const timestamp = 2000;
    const lastHash = 'genesis-hash'
    const hash = 'currenthash'
    const nonce = 1
    const difficulty = 1;
    const data = ['blockchain', 'data']

    const block = new Block({timestamp, lastHash, hash, data, nonce, difficulty})

    describe("MineBlock", ()=>{
        const lastBlock = Block.genesisBlock();
        const data = 'minedData'
        const minedBlock = Block.mineBlock(lastBlock, data)

        it('sets the lasthash to the hash of the last block', ()=>{
            console.log(minedBlock)
            expect(minedBlock.lastHash).toEqual('genesis-hash')
        })

        it('sets the data', ()=>{
            expect(minedBlock.data).toEqual(data)

        })

        it("sets a timestamp", ()=>{
            expect(minedBlock.timestamp).not.toEqual(undefined)
        })

        it("creates a SHA-256 hash on the proper inputs", ()=>{
            expect(minedBlock.hash).toEqual(
                cryptoHash(minedBlock.timestamp, lastBlock.hash, 
                    minedBlock.nonce,
                    minedBlock.difficulty,
                    data)
            )
        })

        it("sets a hash that matches the difficulty criteria", ()=>{
            expect(minedBlock.hash.substring(0,minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty))
        })

        it("Changing the difficulty", ()=>{
            console.log("lastblock", lastBlock)
            console.log("minedblock", minedBlock)
            const results = [lastBlock.difficulty + 1, lastBlock.difficulty-1]
            expect(results.includes(minedBlock.difficulty)).toBe(true)
        })

    })

    describe("CHange difficulty", ()=>{
        it("raises difficulty for quickly mined block", ()=>{
            expect(Block.changeDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE -100
            })).toEqual(block.difficulty + 1)
        })
        it("lowers difficulty for slowly mined block", ()=>{
            expect(Block.changeDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE +100
            })).toEqual(block.difficulty - 1)
        })
    })
})