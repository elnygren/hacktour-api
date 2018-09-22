import { IncomingMessage, ServerResponse } from 'http'
import * as YAML from 'yamljs'
const serve = require('serve-handler');

const eventsData = YAML.load('./src/data.yml');
const scheme = process.env.NODE_ENV === 'production' ? 'https' : 'http'

/** relative url to absolute url */
const urlify = (req: IncomingMessage, relative: string) => (
  `${scheme}://${req.headers.host + relative}`)

/** micro handler with routing */
const handler = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.url && req.url.startsWith('/api/')) {
    return {
      events: eventsData.map((e: any) => ({...e, coverPhoto: urlify(req, e.coverPhoto)}))
    }
  }

  return serve(req, res, {
    public: 'public',
    rewrites: [{ source: '/', destination: '/index.html' }],
  })
}

export default handler
