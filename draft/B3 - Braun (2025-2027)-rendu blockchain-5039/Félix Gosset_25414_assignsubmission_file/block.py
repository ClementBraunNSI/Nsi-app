import hashlib
import time

class Block:
    def __init__(self, index: int, timestamp: int, data: str, previous_hash: str):
        self.Index = index
        self.Timestamp = timestamp
        self.Data = data
        self.Previous_hash = previous_hash
        self.Hash = self.calculate_hash()  

    def calculate_hash(self):
        block_data = str(self.Index) + str(self.Timestamp) + self.Data + self.Previous_hash
        return hashlib.sha256(block_data.encode()).hexdigest()

    def __str__(self):
        return f"Block #{self.Index} [Data: {self.Data}] [Hash: {self.Hash}] [Prev: {self.Previous_hash}]"
