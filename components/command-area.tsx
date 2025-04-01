"use client"

import { useDrop } from "react-dnd"
import CommandBlock from "./command-block"
import { X } from "lucide-react"

interface CommandAreaProps {
  commands: string[]
  onRemoveCommand: (index: number) => void
  currentCommandIndex: number
  isPlaying: boolean
}

export function CommandArea({ commands, onRemoveCommand, currentCommandIndex, isPlaying }: CommandAreaProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "COMMAND",
    drop: () => ({ dropped: true }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  return (
    <div
      ref={drop}
      className={`min-h-[300px] rounded-md border-2 border-dashed p-4 transition-colors ${
        isOver ? "border-primary bg-primary/5" : "border-muted-foreground/20"
      }`}
    >
      {commands.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
          <p>Drag and drop command blocks here</p>
          <p className="text-sm">or click on a command to add it</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {commands.map((command, index) => (
            <div key={`${command}-${index}`} className="group flex items-center gap-2">
              <CommandBlock command={command} isActive={index === currentCommandIndex && isPlaying} />
              <button
                onClick={() => onRemoveCommand(index)}
                className="rounded-full p-1 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
                disabled={isPlaying}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

