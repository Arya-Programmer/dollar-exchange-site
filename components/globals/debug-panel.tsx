"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/lib/theme-context"
import { useAuth } from "@/lib/auth-context"
import {
  X, Trash2, Terminal, RefreshCw, LogOut,
  AlertTriangle, Database, Ban
} from "lucide-react"

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const { theme, loading, error } = useTheme()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (process.env.TESTING === "true") {
      const originalLog = console.log
      const originalError = console.error
      const originalWarn = console.warn

      const formatArg = (arg: any) => {
        if (typeof arg === 'object') return JSON.stringify(arg)
        return String(arg)
      }

      console.log = (...args) => {
        const message = args.map(formatArg).join(' ')
        setLogs(prev => [`[LOG] ${message}`, ...prev].slice(0, 50))
        originalLog.apply(console, args)
      }

      console.error = (...args) => {
        const message = args.map(formatArg).join(' ')
        setLogs(prev => [`[ERR] ${message}`, ...prev].slice(0, 50))
        originalError.apply(console, args)
      }

      console.warn = (...args) => {
        const message = args.map(formatArg).join(' ')
        setLogs(prev => [`[WARN] ${message}`, ...prev].slice(0, 50))
        originalWarn.apply(console, args)
      }

      return () => {
        console.log = originalLog
        console.error = originalError
        console.warn = originalWarn
      }
    }
  }, []);

  if (process.env.NODE_ENV === "production") return null

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-green-400 border border-green-900 px-4 py-2 rounded-lg text-sm font-mono shadow-xl flex items-center gap-2 hover:bg-gray-900 transition-all hover:scale-105"
        >
          <Terminal size={16} />
          DEBUG
          {logs.length > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1 font-bold">
              {logs.length}
            </span>
          )}
        </button>
      )}

      {/* Main Panel */}
      {isOpen && (
        <div className="bg-black/95 backdrop-blur-md border border-gray-800 text-white rounded-xl w-[450px] h-[500px] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">

          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-900/80">
            <h3 className="text-green-400 font-mono font-bold text-xs flex items-center gap-2 uppercase tracking-wider">
              <Terminal size={14} /> System Console
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLogs([])}
                className="p-1.5 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors"
                title="Clear Logs"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-2 p-3 border-b border-gray-800 bg-gray-900/30">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-xs font-medium text-gray-300 transition-colors"
            >
              <RefreshCw size={12} /> Reload App
            </button>

            <button
              onClick={() => {
                localStorage.clear()
                sessionStorage.clear()
                window.location.reload()
              }}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-red-900/30 hover:text-red-400 rounded-md text-xs font-medium text-gray-300 transition-colors"
            >
              <Database size={12} /> Clear Storage
            </button>

            {user ? (
              <>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-xs font-medium text-gray-300 transition-colors"
                >
                  <LogOut size={12} /> Logout ({user.username || 'User'})
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem("access_token", "CORRUPT_TOKEN_TEST")
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-orange-900/30 hover:text-orange-400 rounded-md text-xs font-medium text-gray-300 transition-colors"
                >
                  <Ban size={12} /> Corrupt Token
                </button>
              </>
            ) : (
              <div className="col-span-2 px-3 py-2 text-xs text-gray-500 text-center border border-dashed border-gray-800 rounded-md">
                No active session
              </div>
            )}
          </div>

          {/* System Status Line */}
          <div className="bg-gray-950 px-3 py-1.5 text-[10px] font-mono border-b border-gray-800 flex items-center justify-between text-gray-500">
            <div className="flex gap-3">
              <span>Theme: <span className="text-blue-400">{theme}</span></span>
              <span>Loading: <span className={loading ? "text-yellow-400" : "text-gray-400"}>{loading.toString()}</span></span>
            </div>
            {error && <span className="text-red-400 flex items-center gap-1"><AlertTriangle size={8} /> Error Active</span>}
          </div>

          {/* Logs Area */}
          <div className="flex-1 overflow-auto p-3 font-mono text-xs space-y-1 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            {logs.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-700 space-y-2">
                <Terminal size={24} className="opacity-20" />
                <p>Waiting for logs...</p>
              </div>
            )}

            {logs.map((log, i) => (
              <div key={i} className={`break-all border-b border-gray-800/50 pb-1 mb-1 font-medium ${log.startsWith('[ERR]') ? 'text-red-400 bg-red-900/10 p-1 rounded' :
                log.startsWith('[WARN]') ? 'text-orange-300' :
                  'text-green-300'
                }`}>
                <span className="opacity-30 mr-2 select-none text-[10px]">
                  {new Date().toLocaleTimeString().split(' ')[0]}
                </span>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
