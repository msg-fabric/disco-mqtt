import mfpi_mqtt from '@msg-fabric/disco-mqtt/esm/node/v5.js'
import {hub, id, conn, mf_mqtt_demo} from './demo_common.mjs'

let mf_mqtt = mfpi_mqtt.from_url('mqtt://127.0.0.1:9883/mf-demo-mqtt/')
mf_mqtt.advertize( id, { conn: `tcp://127.0.0.1:${conn.port}` })

hub.router.addDiscovery(
  mf_mqtt.discovery())

await mf_mqtt_demo(mf_mqtt)
