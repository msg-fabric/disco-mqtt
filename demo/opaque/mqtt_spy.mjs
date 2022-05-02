import {opaque, mqtt_url} from './demo_config.mjs'
import mqtt_client from 'u8-mqtt/esm/node/v5.mjs'

const mqtt = mqtt_client()
  .with_tcp(mqtt_url)

await mqtt.connect()
console.log('MQTT Spy Live')

mqtt.sub_topic(
  mqtt_url.pathname+':id',
  async (pkt, params, ctx) => {
    let {payload, b0, dup, topic, props, ... info} = pkt
    console.log("SPY", params, pkt.json(), info)
  })

