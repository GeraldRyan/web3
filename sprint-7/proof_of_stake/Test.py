import random
import string
from validator_slot_unit import ValidatorSlotUnit
from proof_of_stake import ProofOfStake


def get_random_string(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))


if __name__ == '__main__':

    posObject = ProofOfStake()
    posObject.addTokensToStake('harry', 100)
    posObject.addTokensToStake('john', 100)

    harryWins = 0 
    johnWins = 0

    for i in range(100):
        forger = posObject.forgerValidator(get_random_string(i))
        if forger == 'harry':
            harryWins += 1
        elif forger == 'john':
            johnWins += 1;
        
    print('Harry won: ' + str(harryWins) + ' times')
    print('John won: ' + str(johnWins) + ' times')

    # print(posObject.getStakedTokens('harry'))
    # print(posObject.getStakedTokens('john'))
    # print(posObject.getStakedTokens('parker'))

    # slot_unit_object = ValidatorSlotUnit('harry', 1, 'last_hash')
    # print(slot_unit_object.validator_slot_hash())

