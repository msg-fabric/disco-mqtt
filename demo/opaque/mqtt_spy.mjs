import mqtt_client from 'u8-mqtt/esm/node/v4.mjs'
import {demo_url, mqtt_spy_url} from './demo_common.mjs'

mqtt_spy_url(mqtt_client().with_tcp(demo_url), demo_url)
