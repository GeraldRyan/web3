from validator_slot_unit import ValidatorSlotUnit
from proof_of_stake import ProofOfStake

if __name__ == '__main__':
    # posObject = ProofOfStake()
    # posObject.addTokensToStake('harry', 10)
    # posObject.addTokensToStake('john', 100)
    # print(posObject.getStakedTokens('harry'))
    # print(posObject.getStakedTokens('john'))
    # print(posObject.getStakedTokens('parker'))

    slot_unit_object = ValidatorSlotUnit('harry', 1, 'last_hash')
    print(slot_unit_object.validator_slot_hash())