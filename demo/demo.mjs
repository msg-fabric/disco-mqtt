import mqtt_client from 'u8-mqtt/esm/node/v4.mjs'
import mfpi_mqtt from '@msg-fabric/disco-mqtt'
import {hub, id, conn, mf_mqtt_demo} from './demo_common.mjs'

let mf_mqtt = mfpi_mqtt
  .with_client(mqtt_client)
  .from_url('mqtt://127.0.0.1:9883/mf-demo-mqtt/')

mf_mqtt.advertize( id, { conn: `tcp://127.0.0.1:${conn.port}` })

hub.router.addDiscovery(
  mf_mqtt.discovery())

await mf_mqtt_demo(mf_mqtt)

