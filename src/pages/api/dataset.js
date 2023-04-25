import { getTypes, isObject } from "./handle";
import { dataBase, insertRows, createTable, getResults } from "./dbcontroller";

export default async function dataset(req, res) {

  const db = dataBase("db").connection
 
  if(req.method == "POST"){
    const data = JSON.parse(req.body)
    createTable(db,"dataset",data[0],false,["created_at"])
    insertRows(db,"dataset",data)
    const response = await getResults(db,"dataset","")
    res.status(200).json(response)
    
    }


  if(req.method == "GET"){
    const response = await getResults(db,"dataset","")
    res.status(200).json(response)
  }
  
  }
  