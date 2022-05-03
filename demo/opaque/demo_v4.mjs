import mfpi_mqtt from '@msg-fabric/disco-mqtt/esm/node/opaque_v4.js'
import {mf_mqtt_demo, demo_url, opaque} from './demo_common.mjs'

let mf_mqtt = mfpi_mqtt
  .from_opaque(opaque, demo_url)

await mf_mqtt_demo(mf_mqtt)
