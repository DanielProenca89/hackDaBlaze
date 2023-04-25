//Verifica o tipo do valor passado de acordo com as regras do SQLITE
export const getTypes = (value)=>{
    const rules = [
        {name:"FLOAT", type:'number', rule:(value)=>parseFloat(value) == value && value.toString().split('.')[1]},
        {name:"INT", type:'number', rule:(value)=>parseInt(value) == value && !value.toString().split('.')[1]}, 
        {name:"VARCHAR", type:"string", rule:(value)=>value.length <= 255},
        {name:"TEXT", type:"string", rule:(value)=>value.length >= 255},
        {name:"TEXT", type:"object", rule:(value)=> value === Object(value)}
    ]

    const filter = rules.filter(rule=>rule.type == typeof(value) && rule.rule(value))
    console.log(filter)
    return filter[0].name
}


export const isObject = (value)=> value === Object(value)

