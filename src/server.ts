import { IncomingMessage, ServerResponse } from 'http'
import * as YAML from 'yamljs'
const serve = require('serve-handler');

const events = YAML.load('./src/data.yml');
const scheme = process.env.NODE_ENV === 'production' ? 'https' : 'http'
const urlify = (req: IncomingMessage, relative: string) => (
  `${scheme}://${req.headers.host + relative}`)

const handler = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.url && req.url.startsWith('/static/')) {
    return serve(req, res, {public: 'public'})
  }

  if (req.url && req.url.startsWith('/api/')) {
    return {
      events: events.map((e: any) => ({...e, coverPhoto: urlify(req, e.coverPhoto)}))
    }
  }

  return serve(req, res, {
    public: 'public',
    trailingSlash: true,
    rewrites: [{ source: '/', destination: '/index.html' }],
  })

};

export default handler
