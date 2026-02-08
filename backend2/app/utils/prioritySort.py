class PriorityItem:

    def __init__(self, name, priority='A'):
        self.name = name
        self.priority = priority
            
    def priority(self):
        return self.priority

    def name(self):
        return self.name

class PriorityQueue:      
    
    def __init__(self):
        self.priority_list = { 'E': 0, 'D': 0, 'C': 0, 'B': 0, 'A': 0 }
        self.priority_item = []

    def __getStartIndex(self, p):
        start_index = 0
        for priority in sorted(self.priority_list):
            if priority > p:
                start_index += self.priority_list[priority]
            else:
                end_index = start_index + self.priority_list[priority]
                print(end_index)
                return start_index, end_index 

        

    def add_to_queue(self, item_to_add):
        priority = item_to_add.priority
        start_index, end_index = self.__getStartIndex(priority)
        index = start_index
        while index < end_index:
            print(index, end_index)
            item = self.priority_item[index]
            if item.name < item_to_add.name:
                index += 1
                continue
            else:
                break
        self.priority_item.insert(index, item_to_add)
        self.priority_list[priority] += 1
        return True

    def getList(self):
        for item in self.priority_item:
            print(item.name, ":", item.priority)


def sortProduct(option, products, priority_on=False):
    options = ["last_modified", "quantity", "name"]

    match option:
        case "last_modified":
            pass

        case "quantity":
            pass

        case "name":
            pass

