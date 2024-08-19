const { Kafka } = require("kafkajs");
const {client} = require("../../db");

const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: ["localhost:9092"],
});
async function main() {
  const consumer = kafka.consumer({ groupId: "main-worker" });
  await consumer.connect();
  await consumer.subscribe({ topic: "zap-events", fromBeginning: true });

  const producer = kafka.producer()

  await producer.connect( )

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });

      const parsedValue = JSON.parse(message.value?.toString())
      const zapRunId = parsedValue.zapRunId
      const stage = parsedValue.stage

      const zapRunDetails = await client.zapRun.findFirst({
        where: {id: zapRunId},
        include: {zap: {include: {actions: {include: {type: true}}}}}
      })

      const currentAction = zapRunDetails?.zap.actions.find(x => x.sortingOrder === stage)

      if(!currentAction){
        console.log("Current action not found")
        return
      }

      console.log(currentAction)

      if(currentAction.type.name === "email"){
         console.log("sending out an email");   
      }

      if(currentAction.type.name === "solana"){
        console.log("sending out a solana")
      }

      await new Promise(r => setTimeout(r, 500))

      const zapId = message.value?.toString()
      const laststage = (zapRunDetails?.zap.actions?.length || 1) - 1

      if(laststage != stage){
         await producer.send({
          topic: 'zap-events',
          messages: [{
            value: JSON.stringify({
              stage: stage + 1,
              zapRunId
            })
          }]
         })
      }

      console.log('processing done')

      await consumer.commitOffsets([
        {
          topic: "zap-events",
          partition,
          offset: (parseInt(message.offset) + 1).toString()
        },
      ]);
    },
  });
}

main();
