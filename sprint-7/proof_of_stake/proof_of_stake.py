class ProofOfStake():
    def __init__(self):
        self.stakerAccounts = {}
    
    def addTokensToStake(self, publicKeyString, stake):
        if publicKeyString in self.stakerAccounts.keys():
            self.stakerAccounts[publicKeyString] += stake
        else:
            self.stakerAccounts[publicKeyString] = stake

    def getStakedTokens(self, publicKeyString):
        if publicKeyString in self.stakerAccounts.keys():
            return self.stakerAccounts[publicKeyString]
        else: 
            return None  