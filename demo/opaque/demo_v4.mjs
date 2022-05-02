import mfpi_mqtt from '@msg-fabric/disco-mqtt/esm/node/opaque_v4.js'
import {hub, id, conn, mf_mqtt_demo} from './demo_common.mjs'
import {opaque, mqtt_url} from './demo_config.mjs'

let mf_mqtt = mfpi_mqtt
  .from_ctx({opaque}, mqtt_url)
mf_mqtt.advertize( id, { conn: `tcp://127.0.0.1:${conn.port}` })

hub.router.addDiscovery(
  mf_mqtt.discovery())

await mf_mqtt_demo(mf_mqtt)
