import fs from 'fs'
import fetch from 'node-fetch'
import { isNotEmptyString } from '../utils/is'

const log = async (req, data) => {
  const LOG_DISABLED = process.env.LOG_DISABLED
  const LOG_SERVICE_URL = process.env.LOG_SERVICE_URL
  if (!isNotEmptyString(LOG_DISABLED) || JSON.parse(LOG_DISABLED) !== true) {
    const projectName = process.env.PROJECT_NAME || 'chatgpt-web'
    const reqIP = req.ip
    const clientIP = req.headers["CF-Connecting-IP"] || req.headers["cf-connecting-ip"] || req.headers["X-Real-IP"] || req.headers["x-real-ip"] || req.headers["X-Forwarded-For"] || req.headers["x-forwarded-for"] || req.ip // req.connection.remoteAddress
    const realIP = req.header('X-Real-IP') || ''
    const logData = { project_name: projectName, reqIP, clientIP, realIP, time: Date.now(), data }
    // console.log("req", LOG_SERVICE_URL, req.body, logData)

    const filePath = process.env.LOG_FILE_PATH || 'logs.txt'

    // ensure log file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        fs.writeFile(filePath, '', (err) => {
          if (err) {
            console.error('failed to create log file:', err);
          } else {
            console.log('log file created !');
          }
        });
      }
    });

    // save log
    fs.appendFile(filePath, JSON.stringify(logData) + '\n', err => {
      if (err) {
        console.error('append log file failed', err)
      }
    })

    // send log
    if (isNotEmptyString(LOG_SERVICE_URL)) {
      fetch(LOG_SERVICE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: logData,
      })
    }
  }
}

export { log }
