def isLowStock(quantity, reorder_level):
    return quantity <= reorder_level

def isAlmostLowStock(quantity, reorder_level, threshold=0.2):
    return reorder_level < quantity <= reorder_level * (1 + threshold)