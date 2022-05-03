import mqtt_client from 'u8-mqtt/esm/node/v4.mjs'
import mfpi_mqtt from '@msg-fabric/disco-mqtt/esm/opaque.js'
import {mf_mqtt_demo, demo_url, opaque} from './demo_common.mjs'

let mf_mqtt = mfpi_mqtt
  .with_client(mqtt_client)
  .from_opaque(opaque, demo_url)

await mf_mqtt_demo(mf_mqtt)
