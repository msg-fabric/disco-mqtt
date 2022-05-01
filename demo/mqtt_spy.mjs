import mqtt_client from 'u8-mqtt/esm/node/v5.mjs'

const mqtt = mqtt_client()
  .with_tcp('mqtt://127.0.0.1:9883')

await mqtt.connect()
console.log('MQTT Spy Live')

mqtt.sub_topic(
  '/mf-demo-mqtt/:id',
  async (pkt, params, ctx) => {
    let {payload, b0, dup, topic, props, ... info} = pkt
    console.log("SPY", params, pkt.json(), info)
  })

