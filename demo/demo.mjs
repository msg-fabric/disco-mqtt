import FabricHub from 'msg-fabric-core/esm/mf-json-node.js'
import mqtt_client from 'u8-mqtt/esm/node/v4.mjs'
import mfpi_mqtt_with from '../esm/index.js'

await new Promise(v => setTimeout(v, 1200*Math.random()))
console.log("JITTER", new Date().toISOString())

const hub = FabricHub.create()

let id = hub.local.id_route
hub.local.addTarget( 'hello',
  pkt => console.log(`Hello MSG RECV [${id}]:`, pkt.body))
hub.send( [id, 'hello'], { test: 'smoke?'})


let mf_svr = hub.tcp.createServer()
mf_svr.listen({ port: 0, host: '0.0.0.0'})
let conn = await mf_svr.conn_info(true)


let mf_mqtt = mfpi_mqtt_with(mqtt_client)
  .from_url('mqtt://127.0.0.1:9883/mf-demo-mqtt/')

mf_mqtt.advertize( id, { conn: `tcp://127.0.0.1:${conn.port}` })

hub.router.addDiscovery(
  mf_mqtt.discovery())

await mf_mqtt_demo(hub)



async function mf_mqtt_demo(hub) {
  let url = mf_mqtt.url
  let mqtt = mf_mqtt.mqtt_to(url)

  let me = `IAM -- ${hub.local.id_route}`

  mqtt.on_topic( url.pathname + ':id',
    (pkt, params, ctx) => {
      if (params.id != hub.local.id_route) {
        console.log( "SAW:", params, pkt.json())
      } else console.log( "SAW myself!", params, pkt.json())
    })

  mqtt.on_topic( url.pathname + ':id',
    async (pkt, params, ctx) => {
      await hub.send( [params.id, 'hello'],
        { msg: `hello from ${me}`,
          myself: params.id == hub.local.id_route })
    })

  await mqtt.connect()
  await mqtt.subscribe(url.pathname + '#')
}
