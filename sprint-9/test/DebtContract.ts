import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { ethers as hardhatethers} from 'hardhat'
import { PromiseOrValue } from '../typechain-types/common';

export type TermsStruct = {
  loanDaiAmount: PromiseOrValue<BigNumberish>;
  feeDaiAmount: PromiseOrValue<BigNumberish>;
  ethCollateralAmount: PromiseOrValue<BigNumberish>;
  repayByTimestamp: PromiseOrValue<BigNumberish>;
};

describe('DebtContract', async function () {
  async function deployBasicDebtContract() {

    const MIN_BET = BigNumber.from(0);
    const MAX_BET = ethers.utils.parseUnits("2.0");

    const [p1Signer, p2Signer, p3Signer, ...addrs] = await hardhatethers.getSigners();

    const terms: TermsStruct = {
      loanDaiAmount: 50000,
      feeDaiAmount: 200,
      ethCollateralAmount: 50000,
      repayByTimestamp: Date.now() + 100000
    };
    
    const DebtContract = await hardhatethers.getContractFactory('BasicLoan')
    const debtContract = await DebtContract.deploy(terms, 'p1Signer')
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
