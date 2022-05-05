import {mqtt_url} from './config.mjs'
import FabricHub from 'msg-fabric-core/esm/mf-json-node.js'

export const demo_url  = new URL('/mf-mqtt-json/demo/', mqtt_url)

export const jitter_sleep = (ms_jitter=1200, ms_base=0) =>
  new Promise(v => setTimeout(v, ms_base + ms_jitter*Math.random()))

export async function start_demo_hub(ms_jitter=1200) {
  await jitter_sleep(ms_jitter)
  console.log("JITTER", new Date().toISOString())

  const hub = FabricHub.create()

  const id = hub.local.id_route
  hub.local.addTarget( 'hello',
    pkt => console.log(`Hello MSG RECV [${id}]:`, pkt.body))
  hub.send( [id, 'hello'], { test: 'smoke?'})


  const mf_svr = hub.tcp.createServer()
  mf_svr.listen({ port: 0, host: '0.0.0.0'})
  const conn = await mf_svr.conn_info(true)

  return {hub, id, conn}
}


export async function mf_mqtt_demo(mf_mqtt) {
  let {hub, id, conn} = await start_demo_hub()

  hub.router.addDiscovery(
    mf_mqtt.discovery())

  let my_ad = await mf_mqtt.advertize( id,
    { conn: `tcp://127.0.0.1:${conn.port}` })

  await demo_chat(hub, mf_mqtt, my_ad)
}


export async function demo_chat(hub, mf_mqtt, {pub_id}) {
  let url_advert = mf_mqtt.url
  let url_chat = new URL('../chat/', url_advert)

  let mqtt = mf_mqtt.mqtt_to(url_advert)

  let {id_route} = hub.local
  let me = `IAM -- ${JSON.stringify({id_route, pub_id})}`

  mqtt.on_topic( url_advert.pathname + ':id',
    (pkt, params, ctx) => {
      let samp = pkt_sample(pkt)
      if (params.id != pub_id) {
        console.log( "SAW:", params.id, samp)
      } else console.log( "SAW myself!", params.id, samp)
    })

  mqtt.on_topic( url_chat.pathname + ':id',
    (pkt, params) => {
      if (params.id != id_route)
        hub.send( [params.id, 'hello'],
          { msg: `hello from ${me}` })
    })

  await mqtt.connect()
  console.log('connected', {me})

  await mqtt.subscribe(url_advert.pathname + '#')
  //console.log('advert subscribed', url_advert.pathname)

  await mqtt.subscribe(url_chat.pathname + '#')
  //console.log('chat subscribed', url_chat.pathname + '#')

  let cid = new URL(id_route, url_chat).pathname
  while (1) {
    await mqtt.json_post(cid, {chat: me, ts: new Date})
    await jitter_sleep(500, 5000)
  }
}


export async function mqtt_spy_url(mqtt, demo_url) {
  let url_chat = new URL('../chat/', demo_url)

  await mqtt.connect()
  console.log('MQTT Spy Live: %o chat: %o', demo_url.href, url_chat.pathname)

  mqtt.sub_topic(url_chat.pathname + ':id', pkt =>
    console.log("SPY chat: %o %s", pkt.topic, pkt.text()))

  mqtt.sub_topic(demo_url.pathname + ':id', pkt =>
    console.log("SPY advert: %o",
      pkt.topic, pkt_sample(pkt),
      {retain:pkt.retain, qos: pkt.qos}) )
}

function pkt_sample(pkt) {
  let payload=pkt.payload, len=payload.length
  let is_json = 0x7b===payload[0] && 0x7d===payload[len-1] && 0x22===payload[1]
  return is_json ? pkt.json() : {len}
}
