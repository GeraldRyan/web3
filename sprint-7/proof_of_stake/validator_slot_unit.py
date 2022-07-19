from stake_hash_utils import StakeHashUtils

class ValidatorSlotUnit():
    def __init__(self, public_key, iteration, last_block_hash):
        self.public_key = str(public_key);
        self.iteration = iteration
        self.last_block_hash = str(last_block_hash)

    def validator_slot_hash(self):
        hash_data = self.public_key + self.last_block_hash
        for _ in range(self.iteration):
            hash_data = StakeHashUtils.hash(hash_data).hexdigest()
        return hash_data