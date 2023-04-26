import  sqlite3  from 'sqlite3';
import { getTypes, isObject } from './handle';

export const dataBase = (name)=> {
    try{
    const db = new sqlite3.Database(name);
    
        return {status:'200', msg:'ok', connection:db}
    }catch(error){
        return {status:'500' , msg:error, connection:false}
    }
}

export const createTable = (db, name, obj, autoId=true, unique=[])=>{
    try{
    const columns = Object.keys(obj)
    const values = Object.values(obj)
    const cols = columns.map((col,i)=>`${col} ${getTypes(values[i])}`).join(',')
    db.serialize(() => {
        if(unique.length == 0){
        db.run(`CREATE TABLE IF NOT EXISTS ${name} (${autoId?"id INTEGER PRIMARY KEY AUTOINCREMENT,":""}${cols})`);
        }else{
        db.run(`CREATE TABLE IF NOT EXISTS ${name} (${autoId?"id INTEGER PRIMARY KEY AUTOINCREMENT,":""}${cols}, UNIQUE(${unique.join(',')}) )`);
        }
    })       
    return {status:'200', msg:'ok'}
}catch(error){
    return {status:'500', msg:error}
}
}


export const insertRows = (db, table, data)=>{

    const columns = Object.keys(data[0]).join(',')
    const columnsLayout = Object.keys(data[0]).map(e=>"?").join(',')
    db.serialize(() => {
        const stmt = db.prepare(`INSERT IGNORE ${table} (${columns}) VALUES (${columnsLayout})`);
        console.log(`INSERT IGNORE ${table} (${columns}) VALUES (${columnsLayout})`)
        data.forEach(element => {
            stmt.run(Object.values(element).map(e=>isObject(e)?JSON.stringify(e):e)) 
        });
        stmt.finalize();
    })       
}


//Atualiza o item de acordo com os parametros onde column é o nome da coluna, newValue é o novo valor da coluna e where é a cláusula 
//Ex: update(db, "minhaTabela", [{nome:"Jhon"}, {cargo:"Mago"}], "sobrenome = 'Constantini' ")
export const updateRows = (db, table, param, where)=>{

    const setParams = param.map(e=>`${Object.keys(e)} = '${Object.values(e)}'`).join(',')
    db.serialize(() => {
        db.run(`UPDATE ${table} SET ${setParams}' WHERE ${where}`);
    })       
}

export const deleteRows = (db, table, where)=>{

    db.serialize(() => {
     db.run(`DELETE FROM ${table} WHERE ${where}`);

    })       
}


export const getResults = async (db,table, where)=>{
try{
    const sql = `SELECT * FROM ${table}  ${where?"WHERE "+where:""}`
    const result = await new Promise((resolve,reject)=>{
        db.all(sql,[],(err,rows)=>{
                 if(err)reject(err)
                  resolve(rows)
        })
        })
    return result
}catch(error){
    console.log(error)
    return []
}

}










