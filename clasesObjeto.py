class Persona():
    def __init__(self, nombre, apellido, edad):
        self.nombre = nombre
        self.apellido = apellido
        self.edad = edad

    def hablar(self):
        print(self.nombre + " ha hablado")



variable = Persona("Pepito", "Perez", 30)
variable2 = Persona("Juanito", "Gomez", 25)

variable.hablar()





def saludar():
    variable = 5
    if variable == 10:
        return "Pepo"
    
    print("Hola Carlos")


saludar()