# MQTT Discovery plugin for Msg-Fabric

```javascript
import mqtt_client from 'u8-mqtt/esm/node/v4.mjs'
import FabricHub from 'msg-fabric-core/esm/mf-json-node.js'

const hub = FabricHub.create()

let mf_mqtt = mfpi_mqtt_with(mqtt_client)
  .from_url( 'mqtt://127.0.0.1:9883/mf-demo-mqtt/' )

mf_mqtt.advertize( id, { conn: `tcp://127.0.0.1:${port}` })

hub.router.addDiscovery( mf_mqtt.discovery() )
```

## License

[2-Clause BSD](./LICENSE)

