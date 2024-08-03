const { Kafka } = require("kafkajs");
const client = require("../../db");

const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: ["localhost:9092"],
});
async function main() {
  const consumer = kafka.consumer({ groupId: "main-worker" });
  await consumer.connect();
  await consumer.subscribe({ topic: "zap-events", fromBeginning: true });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });

      await new Promise((r) => setTimeout(r, 2000));

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
