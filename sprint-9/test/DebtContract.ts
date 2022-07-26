import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('DebtContract', function () {
  async function deployBasicDebtContract() {
    const DebtContract = await ethers.getContractFactory('DebtContract')
    const debtContract = await DebtContract.deploy()
    console.log(debtContract)
    console.log('HELLO WORLD!!!')
    return { debtContract }
}
    describe('start testing DebtContract', function () {

      it('should return true', async () => {
        const { debtContract } = await loadFixture(deployBasicDebtContract)
        console.log(debtContract)
        console.log('HELLO WORLD!!!')
        expect(3).to.equal(3)
      })
    })

})
