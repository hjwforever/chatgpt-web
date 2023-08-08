import fs from 'fs'
import fetch from 'node-fetch'
import { isNotEmptyString } from '../utils/is'

const log = async (req, data) => {
  const LOG_SERVICE_URL = process.env.LOG_SERVICE_URL
  if (isNotEmptyString(LOG_SERVICE_URL)) {
    const projectName = process.env.PROJECT_NAME || 'chatgpt-web'
    const reqIP = req.ip
    const clientIP = req.header('x-forwarded-for') || req.socket.remoteAddress
    const realIP = req.header('X-Real-IP') || ''
    const logData = { project_name: projectName, reqIP, clientIP, realIP, time: Date.now(), data }
    // console.log("req", req.body, logData)
    fetch(LOG_SERVICE_URL, { method: 'POST', body: logData })
    fs.appendFile(process.env.LOG_FILE_PATH || 'logs.txt', JSON.stringify(logData), (err) => {
      if (err)
        console.error('append log file failed', err)
    })
  }
}

export { log }
