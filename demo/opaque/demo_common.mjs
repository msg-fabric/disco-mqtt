import {opaque_tahoe, opaque_basic} from '@phorbas/opaque'
import {mqtt_url} from '../demo_config.mjs'
export {mf_mqtt_demo, mqtt_spy_url} from '../demo_common.mjs'

export const demo_url  = new URL('/mf-mqtt-opaque/demo/', mqtt_url)
export const opaque = 1 ? opaque_tahoe : opaque_basic

