import { useEffect, useRef, useState } from 'react'
import { Terminal as XTerminal } from "@xterm/xterm"
import { FitAddon } from '@xterm/addon-fit'
import "@xterm/xterm/css/xterm.css"
import { io } from "socket.io-client"
import { Eraser, RefreshCw } from "lucide-react"

function Terminal({ projectId, userId }) {
  const containerRef = useRef()
  const terminalRef = useRef()
  const activeSocketRef = useRef()
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!projectId || !userId) return

    const terminal = new XTerminal({
      cursorBlink: true,
      cursorStyle: "block",
      fontSize: 13,
      fontFamily: "Menlo, Monaco, Consolas, monospace",
      scrollback: 5000,
      theme: {
        background: "#0d0d0f",
        foreground: "#d4d4d4",
        cursor: "#ffffff",
        selectionBackground: "#264f78",
      },
    })

    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)
    terminal.open(containerRef.current)
    terminalRef.current = terminal

    const fitTerminal = () => {
      try {
        fitAddon.fit()
      } catch (error) {
        console.log(error)
      }
    }
    fitTerminal()

    const terminalUrl = import.meta.env.VITE_TERMINAL_SERVICE_URL
    if (!terminalUrl) {
      terminal.write("\r\n\x1b[31mVITE_TERMINAL_SERVICE_URL missing\x1b[0m\r\n")
      return () => terminal.dispose()
    }

    // Removed transports: ["websocket"] to allow proper handshake fallback
    const socket = io(terminalUrl, {
      withCredentials: true,
    })
    activeSocketRef.current = socket

    socket.on("connect", () => {
      if (activeSocketRef.current !== socket) return
      setConnected(true)
      fitTerminal()
      socket.emit("terminal:init", { projectId, userId, rows: terminal.rows, cols: terminal.cols })
    })

    socket.on("terminal:data", (data) => {
      if (activeSocketRef.current !== socket) return
      terminal.write(String(data || ""))
    })

    socket.on("terminal:ready", () => {
      if (activeSocketRef.current !== socket) return
      fitTerminal()
      socket.emit("terminal:resize", { rows: terminal.rows, cols: terminal.cols })
      terminal.focus()
    })

    const input = terminal.onData((data) => {
      if (!socket.connected) return
      socket.emit("terminal:write", data)
    })

    const resizeTerminal = () => {
      fitTerminal()
      if (!socket.connected) return
      socket.emit("terminal:resize", { cols: terminal.cols, rows: terminal.rows })
    }

    window.addEventListener("resize", resizeTerminal)

    const resizeObserver = new ResizeObserver(resizeTerminal)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    const focusTerminal = () => {
      terminal.focus()
    }

    const containerEl = containerRef.current
    if (containerEl) {
      containerEl.addEventListener("click", focusTerminal)
    }

    socket.on("connect_error", (error) => {
      if (activeSocketRef.current !== socket) return
      setConnected(false)
      terminal.write(`\r\n\x1b[31m${error.message}\x1b[0m\r\n`)
    })

    socket.on("disconnect", () => {
      if (activeSocketRef.current !== socket) return
      setConnected(false)
    })

    return () => {
      window?.removeEventListener("resize", resizeTerminal)
      resizeObserver.disconnect()
      if (containerEl) {
        containerEl.removeEventListener("click", focusTerminal)
      }
      input.dispose()
      if (activeSocketRef.current === socket) {
        activeSocketRef.current = null
      }
      socket.disconnect()
      terminal.dispose()
    }
  }, [projectId, userId])

  const clearTerminal = () => {
    const terminal = terminalRef.current
    if (!terminal) return
    terminal.clear()
    terminal.write("\x1b[2J\x1b[H")
    terminal.focus()
  }

  const syncProjectFiles = () => {
    const socket = activeSocketRef.current
    if (!socket?.connected) return

    socket.emit("terminal:sync", (result) => {
      if (activeSocketRef.current !== socket) return

      if (result?.success) {
        terminalRef.current?.write("\r\n\x1b[32mProject files synced to terminal workspace.\x1b[0m\r\n")
        return
      }

      terminalRef.current?.write(`\r\n\x1b[31mProject sync failed: ${result?.message || "Unknown error"}\x1b[0m\r\n`)
    })
  }

  return (
    <div className="flex h-full flex-col bg-[#0d0d0f]">
      <div className="flex h-7 shrink-0 items-center justify-between border-b border-white/[0.05] px-3">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-400" : "bg-zinc-600"}`} />
          <span className="text-[11px] text-zinc-500">
            {connected ? "terminal - connected" : "terminal - disconnected"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={syncProjectFiles}
            title="Sync website project files to terminal workspace"
            disabled={!connected}
            className="rounded p-1 text-zinc-500 transition-colors hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RefreshCw size={12} />
          </button>
          <button
            onClick={clearTerminal}
            title="Clear terminal"
            className="rounded p-1 text-zinc-500 transition-colors hover:bg-white/15 hover:text-white"
          >
            <Eraser size={12} />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="min-h-0 flex-1 overflow-hidden" />
    </div>
  )
}

export default Terminal