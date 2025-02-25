import { execSync } from 'child_process'
import { Response, Router, Request } from 'express'
import { redis } from '../../util/redis'
import { sendPayloadToClients } from '../../websocket/handlers/connection'

const githubRouter = Router()

githubRouter.post('/hook', (req: Request, res: Response) => {
	const data = req.body
	console.log(data)
	// we dont care
	if (data.repository.name != 'Easter-Boat')
		return res.status(200).send({ status: 200 })
	const branch = (data.ref as string).split('/')[2]
	if (!branch || !['main', 'dev', 'semi-rewrite'].includes(branch)) {
		// we dont care
		return res.status(200).send({ status: 200 })
	}

	//sendPayloadToClients({ event: 'DEPLOY', bot: branch })
	redis.publish("Boat", JSON.stringify({ event: 'DEPLOY', bot: branch }))

	return res.status(200).send({ status: 200 })
})

export default githubRouter
