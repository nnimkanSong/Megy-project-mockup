"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface CharacterViewerProps {
  commands: string[]
  currentCommandIndex: number
  isPlaying: boolean
}

export default function CharacterViewer({ commands, currentCommandIndex, isPlaying }: CharacterViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [position, setPosition] = useState({ x: 150, y: 150 })
  const [direction, setDirection] = useState(0) // 0: up, 1: right, 2: down, 3: left
  const [isJumping, setIsJumping] = useState(false)
  const [isWaving, setIsWaving] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  // Draw the character
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#e5e7eb"
    for (let i = 0; i < canvas.width; i += 30) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 30) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw character
    ctx.save()
    ctx.translate(position.x, position.y)
    ctx.rotate((Math.PI / 2) * direction)

    // Body
    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.arc(0, 0, 15, 0, Math.PI * 2)
    ctx.fill()

    // Face direction indicator
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(0, -7, 5, 0, Math.PI * 2)
    ctx.fill()

    // Arms
    if (isWaving) {
      // Waving animation
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(-15, 0)
      ctx.lineTo(-25, -15)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(15, 0)
      ctx.lineTo(25, -15)
      ctx.stroke()
    } else {
      // Normal arms
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(-15, 0)
      ctx.lineTo(-25, isJumping ? -5 : 10)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(15, 0)
      ctx.lineTo(25, isJumping ? -5 : 10)
      ctx.stroke()
    }

    // Legs
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(-7, 15)
    ctx.lineTo(-10, isJumping ? 20 : 30)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(7, 15)
    ctx.lineTo(10, isJumping ? 20 : 30)
    ctx.stroke()

    ctx.restore()
  }, [position, direction, isJumping, isWaving])

  // Execute current command
  useEffect(() => {
    if (!isPlaying || currentCommandIndex < 0 || currentCommandIndex >= commands.length) {
      return
    }

    const command = commands[currentCommandIndex]
    let newLog = ""

    switch (command) {
      case "moveForward":
        setPosition((prev) => {
          const newPos = { ...prev }
          if (direction === 0) newPos.y -= 30
          else if (direction === 1) newPos.x += 30
          else if (direction === 2) newPos.y += 30
          else if (direction === 3) newPos.x -= 30

          // Keep within bounds
          newPos.x = Math.max(20, Math.min(280, newPos.x))
          newPos.y = Math.max(20, Math.min(280, newPos.y))

          return newPos
        })
        newLog = "Moving forward"
        break
      case "moveBackward":
        setPosition((prev) => {
          const newPos = { ...prev }
          if (direction === 0) newPos.y += 30
          else if (direction === 1) newPos.x -= 30
          else if (direction === 2) newPos.y -= 30
          else if (direction === 3) newPos.x += 30

          // Keep within bounds
          newPos.x = Math.max(20, Math.min(280, newPos.x))
          newPos.y = Math.max(20, Math.min(280, newPos.y))

          return newPos
        })
        newLog = "Moving backward"
        break
      case "turnLeft":
        setDirection((prev) => (prev + 3) % 4)
        newLog = "Turning left"
        break
      case "turnRight":
        setDirection((prev) => (prev + 1) % 4)
        newLog = "Turning right"
        break
      case "jump":
        setIsJumping(true)
        setTimeout(() => setIsJumping(false), 500)
        newLog = "Jumping"
        break
      case "wave":
        setIsWaving(true)
        setTimeout(() => setIsWaving(false), 500)
        newLog = "Waving"
        break
    }

    setLogs((prev) => [...prev, `${currentCommandIndex + 1}. ${newLog}`])
  }, [currentCommandIndex, commands, isPlaying])

  // Reset logs when starting new execution
  useEffect(() => {
    if (currentCommandIndex === 0) {
      setLogs([])
    }
  }, [currentCommandIndex])

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full max-w-[300px] overflow-hidden rounded-md border bg-white">
        <canvas ref={canvasRef} width={300} height={300} className="absolute inset-0" />
      </div>

      <div className="rounded-md border bg-muted/30 p-4">
        <h3 className="mb-2 font-medium">Execution Log:</h3>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No commands executed yet</p>
        ) : (
          <div className="max-h-[150px] overflow-y-auto">
            {logs.map((log, index) => (
              <div
                key={index}
                className={cn(
                  "text-sm",
                  index === logs.length - 1 ? "text-foreground font-medium" : "text-muted-foreground",
                )}
              >
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

