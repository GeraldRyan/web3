import hashlib
import json

class StakeHashUtils():

    @staticmethod
    def hash(data):
        data_string = json.dumps(data)
        data_bytes = data_string.encode('utf-8')
        data_hash = hashlib.sha256(data_bytes)
        return data_hash