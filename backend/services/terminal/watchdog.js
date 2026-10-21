import { fork } from "child_process"
import { fileURLToPath } from "url"

const workerPath = fileURLToPath(new URL("./index.js", import.meta.url))
const heartbeatInterval = 5000
const heartbeatTimeout = 15000
const restartDelay = 1000

let worker
let lastHeartbeat = 0
let heartbeatTimer
let restartTimer
let shuttingDown = false

const scheduleRestart = () => {
  if (shuttingDown || restartTimer) return

  restartTimer = setTimeout(() => {
    restartTimer = null
    startWorker()
  }, restartDelay)
}

const startWorker = () => {
  if (shuttingDown || worker) return

  try {
    const child = fork(workerPath, [], { stdio: "inherit" })
    worker = child
    lastHeartbeat = Date.now()

    child.on("message", (message) => {
      if (worker === child && message === "heartbeat:pong") {
        lastHeartbeat = Date.now()
      }
    })

    child.once("error", (error) => {
      console.error("Terminal worker error:", error)
      if (worker === child) {
        worker = null
        child.kill()
        scheduleRestart()
      }
    })

    child.once("exit", (code, signal) => {
      if (worker === child) worker = null
      if (shuttingDown) return

      console.error(`Terminal worker exited (code ${code}, signal ${signal})`)
      scheduleRestart()
    })
  } catch (error) {
    console.error("Failed to start terminal worker:", error)
    scheduleRestart()
  }
}

heartbeatTimer = setInterval(() => {
  const activeWorker = worker
  if (!activeWorker) return

  if (Date.now() - lastHeartbeat > heartbeatTimeout) {
    console.error("Terminal worker stopped responding; restarting it")
    worker = null
    activeWorker.kill()
    scheduleRestart()
    return
  }

  activeWorker.send("heartbeat:ping", (error) => {
    if (error && worker === activeWorker) {
      console.error("Terminal worker heartbeat failed:", error)
      worker = null
      activeWorker.kill()
      scheduleRestart()
    }
  })
}, heartbeatInterval)

const shutdown = () => {
  if (shuttingDown) return
  shuttingDown = true
  clearInterval(heartbeatTimer)
  clearTimeout(restartTimer)
  worker?.kill()
  process.exit(0)
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)

startWorker()
