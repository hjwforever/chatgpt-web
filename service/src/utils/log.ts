import fs from 'fs'
import fetch from 'node-fetch'
import { isNotEmptyString } from '../utils/is'

const log = async (req, data) => {
  const LOG_DISABLED = process.env.LOG_DISABLED
  const LOG_SERVICE_URL = process.env.LOG_SERVICE_URL
  if (!isNotEmptyString(LOG_DISABLED) || JSON.parse(LOG_DISABLED) !== true) {
    const projectName = process.env.PROJECT_NAME || 'chatgpt-web'
    const reqIP = req.ip
    const clientIP = req.header('x-forwarded-for') || req.socket.remoteAddress
    const realIP = req.header('X-Real-IP') || ''
    const logData = { project_name: projectName, reqIP, clientIP, realIP, time: Date.now(), data }
    // console.log("req", LOG_SERVICE_URL, req.body, logData)
    fs.appendFile(process.env.LOG_FILE_PATH || 'logs.txt', JSON.stringify(logData) + '\n', err => {
      if (err) {
        console.error('append log file failed', err)
      }
    })
    if (isNotEmptyString(LOG_SERVICE_URL)) {
      fetch(LOG_SERVICE_URL, { method: 'POST', body: logData })
    }
  }
}

export { log }
