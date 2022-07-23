from http.cookiejar import LWPCookieJar
from typing import List, Optional, Union
from validator_slot_unit import ValidatorSlotUnit
from stake_hash_utils import StakeHashUtils
class ProofOfStake():
    def __init__(self):
        self.stakerAccounts: dict = {}
    
    def addTokensToStake(self, publicKeyString: str, stake: Union[int, float])-> None:
        if publicKeyString in self.stakerAccounts.keys():
            self.stakerAccounts[publicKeyString] += stake
        else:
            self.stakerAccounts[publicKeyString] = stake

    def getStakedTokens(self, publicKeyString: str) -> int:
        if publicKeyString in self.stakerAccounts.keys():
            return self.stakerAccounts[publicKeyString]
        else: 
            return 0

    def validatorSlots(self, seed):
        '''
        initializes n slots to be validated by m <= n validators 
        '''
        slots = [] 
        for validator in self.stakerAccounts.keys():
            for stake in range(self.getStakedTokens(validator)):
                slots.append(ValidatorSlotUnit(validator, stake+1, seed))
        return slots

    # What is an offset? What is a winner slot? 
    def winnerSlot(self, slots, seed):
        winnerSlot = None
        leastOffset = None
        referenceHashInitValue = int(StakeHashUtils.hash(seed).hexdigest(),16)
        for slot in slots:
            slotIntValue = int(slot.validator_slot_hash(), 16)
            offset = abs(slotIntValue - referenceHashInitValue)
            if leastOffset is None or offset < leastOffset:
                leastOffset = offset
                winnerSlot = slot
        return winnerSlot
    
    def forgerValidator(self, lastBlockHash):
        slots = self.validatorSlots(lastBlockHash)
        winnerSlot = self.winnerSlot(slots, lastBlockHash)
        return winnerSlot.public_key
