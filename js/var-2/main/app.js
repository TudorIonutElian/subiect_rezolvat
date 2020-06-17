class Duck{
    constructor(name){
        if(typeof name === "string" || typeof name === "String"){
            this.name = name
        }else{
            throw "name must be string or String";
        }
    }
    move(){
        return `${this.name} is moving`
    }
    swim(){
        return `${this.name} is swimming`
    }
}

class RubberDuck extends Duck{
    constructor(name){
        super(name)
        if(typeof name === "string" || typeof name === "String"){
            this.name = name
        }else{
            throw "name must be string or String";
        }
        
    }
    float(){
        return `${this.name} floats`
    }
    swim(){
        return `${this.name} can't swim, only float`
    }
}



const app = {
    Duck,
    RubberDuck
}

module.exports = app