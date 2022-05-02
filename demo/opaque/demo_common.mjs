import FabricHub from 'msg-fabric-core/esm/mf-json-node.js'

await new Promise(v => setTimeout(v, 1200*Math.random()))
console.log("JITTER", new Date().toISOString())

export const hub = FabricHub.create()

export const id = hub.local.id_route
hub.local.addTarget( 'hello',
  pkt => console.log(`Hello MSG RECV [${id}]:`, pkt.body))
hub.send( [id, 'hello'], { test: 'smoke?'})


const mf_svr = hub.tcp.createServer()
mf_svr.listen({ port: 0, host: '0.0.0.0'})
export const conn = await mf_svr.conn_info(true)


export async function mf_mqtt_demo(mf_mqtt) {
  let url = mf_mqtt.url
  let mqtt = mf_mqtt.mqtt_to(url)

  let me = `IAM -- ${hub.local.id_route}`
  console.log( me, url.href)

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

