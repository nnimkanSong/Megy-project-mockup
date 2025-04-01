"use client"

import { useState, useEffect } from "react"
import CommandBlock from "@/components/command-block"
import CharacterViewer from "@/components/character-viewer"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { CommandArea } from "@/components/command-area"
import { Button } from "@/components/ui/button"
import { Play, Trash2, RotateCcw } from "lucide-react"

export default function Home() {
  const [commands, setCommands] = useState<string[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentCommandIndex, setCurrentCommandIndex] = useState(-1)

  const availableCommands = ["moveForward", "moveBackward", "turnLeft", "turnRight", "jump", "wave"]

  const addCommand = (command: string) => {
    setCommands([...commands, command])
  }

  const removeCommand = (index: number) => {
    const newCommands = [...commands]
    newCommands.splice(index, 1)
    setCommands(newCommands)
  }

  const clearCommands = () => {
    setCommands([])
    setIsPlaying(false)
    setCurrentCommandIndex(-1)
  }

  const playCommands = () => {
    if (commands.length === 0) return

    setIsPlaying(true)
    setCurrentCommandIndex(0)
  }

  const resetPlayback = () => {
    setIsPlaying(false)
    setCurrentCommandIndex(-1)
  }

  useEffect(() => {
    if (!isPlaying) return

    if (currentCommandIndex >= commands.length) {
      setIsPlaying(false)
      setCurrentCommandIndex(-1)
      return
    }

    const timer = setTimeout(() => {
      setCurrentCommandIndex(currentCommandIndex + 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isPlaying, currentCommandIndex, commands.length])

  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b bg-background p-4">
        <h1 className="text-2xl font-bold">Block Programming Environment</h1>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <DndProvider backend={HTML5Backend}>
          <div className="flex w-full flex-col border-r md:w-1/2">
            <div className="border-b p-4">
              <h2 className="mb-4 text-xl font-semibold">Command Blocks</h2>
              <div className="flex flex-wrap gap-2">
                {availableCommands.map((command) => (
                  <CommandBlock key={command} command={command} isDraggable={true} onAddCommand={addCommand} />
                ))}
              </div>
            </div>

            <div className="flex-1 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Program</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={resetPlayback} disabled={!isPlaying}>
                    <RotateCcw className="mr-1 h-4 w-4" />
                    Reset
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearCommands} disabled={commands.length === 0}>
                    <Trash2 className="mr-1 h-4 w-4" />
                    Clear
                  </Button>
                  <Button size="sm" onClick={playCommands} disabled={isPlaying || commands.length === 0}>
                    <Play className="mr-1 h-4 w-4" />
                    Run
                  </Button>
                </div>
              </div>

              <CommandArea
                commands={commands}
                onRemoveCommand={removeCommand}
                currentCommandIndex={currentCommandIndex}
                isPlaying={isPlaying}
              />
            </div>
          </div>

          <div className="flex w-full flex-col md:w-1/2">
            <div className="p-4">
              <h2 className="mb-4 text-xl font-semibold">Character Output</h2>
              <CharacterViewer commands={commands} currentCommandIndex={currentCommandIndex} isPlaying={isPlaying} />
            </div>
          </div>
        </DndProvider>
      </div>
    </main>
  )
}

