import {opaque_basic, opaque_tahoe} from '@phorbas/opaque'

export const mqtt_url = new URL('mqtt://127.0.0.1:9883/mf-opaque-mqtt/')
export const opaque = 0 ? opaque_basic : opaque_tahoe

