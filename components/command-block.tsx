"use client"

import { useDrag } from "react-dnd"
import { cn } from "@/lib/utils"
import { ArrowUp, ArrowDown, RotateCcw, RotateCw, ArrowBigUp, Hand } from "lucide-react"

interface CommandBlockProps {
  command: string
  isDraggable?: boolean
  isActive?: boolean
  onAddCommand?: (command: string) => void
}

export default function CommandBlock({
  command,
  isDraggable = false,
  isActive = false,
  onAddCommand,
}: CommandBlockProps) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "COMMAND",
      item: { command },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<{ dropped: boolean }>()
        if (item && dropResult?.dropped && onAddCommand) {
          onAddCommand(command)
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [command, onAddCommand],
  )

  const getCommandIcon = () => {
    switch (command) {
      case "moveForward":
        return <ArrowUp className="h-4 w-4" />
      case "moveBackward":
        return <ArrowDown className="h-4 w-4" />
      case "turnLeft":
        return <RotateCcw className="h-4 w-4" />
      case "turnRight":
        return <RotateCw className="h-4 w-4" />
      case "jump":
        return <ArrowBigUp className="h-4 w-4" />
      case "wave":
        return <Hand className="h-4 w-4" />
      default:
        return null
    }
  }

  const getCommandLabel = () => {
    switch (command) {
      case "moveForward":
        return "Move Forward"
      case "moveBackward":
        return "Move Backward"
      case "turnLeft":
        return "Turn Left"
      case "turnRight":
        return "Turn Right"
      case "jump":
        return "Jump"
      case "wave":
        return "Wave"
      default:
        return command
    }
  }

  const getCommandColor = () => {
    switch (command) {
      case "moveForward":
      case "moveBackward":
        return "bg-blue-100 border-blue-300 text-blue-700"
      case "turnLeft":
      case "turnRight":
        return "bg-purple-100 border-purple-300 text-purple-700"
      case "jump":
        return "bg-green-100 border-green-300 text-green-700"
      case "wave":
        return "bg-amber-100 border-amber-300 text-amber-700"
      default:
        return "bg-gray-100 border-gray-300 text-gray-700"
    }
  }

  return (
    <div
      ref={isDraggable ? drag : undefined}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium shadow-sm transition-all",
        getCommandColor(),
        isDraggable && "hover:shadow-md",
        isDragging && "opacity-50",
        isActive && "ring-2 ring-offset-1 ring-blue-500",
      )}
      onClick={() => {
        if (!isDraggable && onAddCommand) {
          onAddCommand(command)
        }
      }}
    >
      {getCommandIcon()}
      {getCommandLabel()}
    </div>
  )
}

