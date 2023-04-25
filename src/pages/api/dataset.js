
import { dataBase, createTable, getResults, insertRows } from './dbcontroller';
import * as tf from '@tensorflow/tfjs'
import _ from 'lodash'



export default async function dataset(req, res) {

  const db = dataBase("/tmp/db").connection

 
  if(req.method == "POST"){
    const data = JSON.parse(req.body)
    createTable(db,"dataset",data[0],false)
    insertRows(db,"dataset",data)
    const response = await getResults(db,"dataset","")
    res.status(200).json(response)

    /*const response = await getData()

    res.status(200).json(response)
    toJsonFile(data, "inputs")*/
    
    }


  if(req.method == "GET"){

    function chunkArray(arr, size) {
      const chunks = [];
      for (let i = 0; i < arr.length; i += size) {
        const chunk = arr.slice(i, i + size);
        chunks.push(chunk);
      }
      return chunks;
  }
  
  
  async function TrainAndPredict(arr){
  
      const lbl = []
      const arrData = chunkArray(arr.sort((a,b)=>new Date(a.created_at).getTime() - new Date(a.created_at).getTime()).map(e=>parseFloat(e.crash_point)),6).map(e=>{
        let result = e.pop()
        lbl.push(result)
        return e    
      })
    console.log(arrData)
    console.log(lbl)
    
      const data = tf.tensor2d(arrData.slice(0, -1))
      const labels = tf.tensor1d(lbl.slice(0, -1));
      
      // Agrupe os dados e rótulos em lotes de tamanho 6.
      
      // Defina o modelo com uma camada densa.
      //const model = tf.sequential();
      //model.add(tf.layers.dense({units: 1, inputShape: [5]}));
      const model = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [5], units: 32, activation: 'relu' }),
          tf.layers.dense({ units: 1}),
        ]
      });
      model.compile({loss: 'meanSquaredError', optimizer: "Adamax"});
      //model.compile({ optimizer: tf.train.adam(0.0031441251), loss: 'meanSquaredError' });
    
      // Treine o modelo com cada lote.
      await model.fit(data, labels, {epochs: 72});
     
      // Use o modelo para fazer previsões.
      const testData = tf.tensor2d([arr.slice(0,5).map(e =>parseFloat(e.crash_point))]);
      const predictions = model.predict(testData);
      console.log(predictions.dataSync())
      return {response:predictions.dataSync()[0]}
    }


    const dataset = await getResults(db,"dataset","")
    console.log(dataset)
    const result = await TrainAndPredict(dataset)

    res.status(200).json(result)

  }
  
  }
  