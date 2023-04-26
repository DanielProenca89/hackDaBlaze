
import { dataBase, createTable, getResults, insertRows } from './dbcontroller';
import * as tf from '@tensorflow/tfjs'
import _ from 'lodash'



export default async function dataset(req, res) {

  const db = dataBase("/tmp/db").connection

 
  if(req.method == "POST"){
    const data = JSON.parse(req.body)
    createTable(db,"dataset",data[0],false,["id"])
    insertRows(db,"dataset",data)
    res.status(200)

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
      const arrData = chunkArray(arr.map(e=>parseFloat(e.crash_point)),22).map(e=>{
        let result = e.pop()
        e.pop()
        lbl.push(result)
        return e    
      })
    console.log(arrData)
    console.log(lbl)
    
      const data = tf.tensor2d(arrData.slice(0, -1).map(e=>{
        return e.map(e=>parseFloat(e))
      }))

      arrData.slice(0, -1).map(e=>{
        return e.map(e=>parseInt(`${e}`.split('.')[0]))
      }).forEach





      const labels = tf.tensor1d(lbl.slice(0, -1).map(e=>parseInt(e)));
      
      // Agrupe os dados e rótulos em lotes de tamanho 6.
      
      // Defina o modelo com uma camada densa.
      
      const model = tf.sequential({
      layers: [
        tf.layers.dense({inputShape: [20], units: 32, activation: 'relu'}),
        tf.layers.dense({units: 1}),
        
      ]
      });

      function onBatchEnd(batch, logs) {
      console.log('Precisão', logs.acc);
      }

      model.compile({loss: 'meanSquaredError', optimizer: 'adam', metrics: ['accuracy']});
      let prec = 0
// Treina por 5 épocas com tamanho de lote 32.
     await model.fit(data, labels, {
        epochs: 30,
        batchSize:32,
        callbacks: {onBatchEnd}
      }).then(info => {
        console.log('Precisão final', info.history.acc);
        prec = info.history.acc[0]
      });


     
      const testData = tf.tensor2d([arr.slice(0,20).map(e =>parseFloat(e.crash_point))]);
      const predictions = model.predict(testData);
      console.log(predictions.dataSync())
      return {response:predictions.dataSync()[0]*prec, lastResult:arr[0].created_at}
    }


    const dataset = await getResults(db,"dataset","")
    console.log(dataset)
    const result = await TrainAndPredict(dataset)

    res.status(200).json(result)

  }
  
  }
  