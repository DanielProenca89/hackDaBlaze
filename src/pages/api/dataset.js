import * as fs from 'fs'


const getData=async ()=>{

  const res  = fs.readFileSync(`inputs.json` , "utf8")
  return JSON.parse(res)
}

const toJsonFile=(data, name)=>{
  fs.writeFile(`${name}.json`, JSON.stringify(data), err => {
      if (err) throw err 
      console.log("Done writing JSON")
  })
}


export default async function dataset(req, res) {

  //const db = dataBase(":memory:").connection
 
  if(req.method == "POST"){
    const data = JSON.parse(req.body)
  /*  createTable(db,"dataset",data[0],false,["created_at"])
    insertRows(db,"dataset",data)
    const response = await getResults(db,"dataset","")
    res.status(200).json(response)
    db.close()*/
    const response = await getData()

    res.status(200).json(response)
    toJsonFile(data, "inputs")
    
    }


  if(req.method == "GET"){
   /* const response = await getResults(db,"dataset","")
    db.close()*/

    const response = await getData()

    res.status(200).json(response)
  }
  
  }
  