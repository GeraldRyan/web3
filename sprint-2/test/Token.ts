const { expect } = require('chai');
const { ethers } = require("hardhat"); // explicit typing, not required, just preference
import {Token} from "../typechain/Token"

describe("Token Contract", ()=>{
    it("Deployment should assign the total supply of tokens to the owner", async ()=>{
        const [owner, addr1, addr2] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Token");

        // but who deployed it? // when using the hardhat-ethers plugin ContractFactory and Contract instances are connected to the first signer by default
        const hardhatToken: Token = await Token.deploy();

        const ownerBalance = await hardhatToken.balanceOf(owner.address);
        expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);

        await hardhatToken.transfer(addr1.address, 50);
        expect (await hardhatToken.balanceOf(addr1.address)).to.equal(50);

        await hardhatToken.connect(addr1).transfer(addr2.address, 49);
        expect (await hardhatToken.balanceOf(addr2.address)).to.equal(49);


    })
})