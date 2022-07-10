from proof_of_stake import ProofOfStake

if __name__ == '__main__':
    posObject = ProofOfStake()
    posObject.addTokensToStake('harry', 10)
    posObject.addTokensToStake('john', 100)
    print(posObject.getStakedTokens('harry'))
    print(posObject.getStakedTokens('john'))
    print(posObject.getStakedTokens('parker'))