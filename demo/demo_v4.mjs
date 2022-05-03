import mfpi_mqtt from '@msg-fabric/disco-mqtt/esm/node/v4.js'
import {mf_mqtt_demo, demo_url} from './demo_common.mjs'

let mf_mqtt = mfpi_mqtt.from_url(demo_url)
await mf_mqtt_demo(mf_mqtt)
