import enum

class UserRole(enum.Enum):
    Admin = "admin"
    Engineer = "Engineer"
    SalesPerson = "SalesPerson"

class SecurityQuestion(enum.Enum):
    motherMaiden = "mother_maiden"
    firstPet = "first_pet"
    firstSchool = "first_school"

class SecurityQuestionExpanded(enum.Enum):
    mother_maiden = "What is the your mother's maiden name?"
    first_pet = "What is the name of your first pet?"
    first_school = "What is the name of your first_school?"