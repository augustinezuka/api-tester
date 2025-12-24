"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, Settings2 } from "lucide-react"

interface Environment {
  id: string
  name: string
  variables: { key: string; value: string }[]
}

export function EnvironmentPanel() {
  const [environments, setEnvironments] = useState<Environment[]>([])
  const [activeEnv, setActiveEnv] = useState<string>("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("apicraft_environments")
    const active = localStorage.getItem("apicraft_active_environment")
    if (saved) setEnvironments(JSON.parse(saved))
    if (active) setActiveEnv(active)
  }, [])

  const saveEnvironments = (envs: Environment[]) => {
    localStorage.setItem("apicraft_environments", JSON.stringify(envs))
    setEnvironments(envs)
  }

  const addEnvironment = () => {
    const newEnv: Environment = {
      id: Date.now().toString(),
      name: "New Environment",
      variables: [],
    }
    saveEnvironments([...environments, newEnv])
  }

  const updateEnvironment = (id: string, updates: Partial<Environment>) => {
    saveEnvironments(environments.map((e) => (e.id === id ? { ...e, ...updates } : e)))
  }

  const deleteEnvironment = (id: string) => {
    saveEnvironments(environments.filter((e) => e.id !== id))
    if (activeEnv === id) {
      setActiveEnv("")
      localStorage.removeItem("apicraft_active_environment")
    }
  }

  const setActive = (id: string) => {
    setActiveEnv(id)
    localStorage.setItem("apicraft_active_environment", id)
  }

  const addVariable = (envId: string) => {
    const env = environments.find((e) => e.id === envId)
    if (env) {
      updateEnvironment(envId, {
        variables: [...env.variables, { key: "", value: "" }],
      })
    }
  }

  const updateVariable = (envId: string, index: number, field: "key" | "value", value: string) => {
    const env = environments.find((e) => e.id === envId)
    if (env) {
      const newVars = [...env.variables]
      newVars[index] = { ...newVars[index], [field]: value }
      updateEnvironment(envId, { variables: newVars })
    }
  }

  const deleteVariable = (envId: string, index: number) => {
    const env = environments.find((e) => e.id === envId)
    if (env) {
      updateEnvironment(envId, {
        variables: env.variables.filter((_, i) => i !== index),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Settings2 className="h-4 w-4" />
          Environment
          {activeEnv && (
            <span className="text-xs text-muted-foreground">
              ({environments.find((e) => e.id === activeEnv)?.name})
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Environments</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 flex-1 min-h-0">
          <div className="w-48 border-r border-border pr-4 space-y-2">
            <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent" onClick={addEnvironment}>
              <Plus className="h-4 w-4" />
              New Environment
            </Button>

            <ScrollArea className="h-[400px]">
              <div className="space-y-1">
                {environments.map((env) => (
                  <div
                    key={env.id}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-accent ${
                      activeEnv === env.id ? "bg-accent" : ""
                    }`}
                    onClick={() => setActive(env.id)}
                  >
                    <span className="flex-1 text-sm truncate">{env.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteEnvironment(env.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex-1 space-y-4 overflow-auto">
            {activeEnv && environments.find((e) => e.id === activeEnv) ? (
              <>
                <div>
                  <Label>Environment Name</Label>
                  <Input
                    value={environments.find((e) => e.id === activeEnv)?.name || ""}
                    onChange={(e) => updateEnvironment(activeEnv, { name: e.target.value })}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Variables</Label>
                    <Button variant="outline" size="sm" onClick={() => addVariable(activeEnv)}>
                      <Plus className="h-3 w-3 mr-1" />
                      Add Variable
                    </Button>
                  </div>

                  <ScrollArea className="h-[300px] border border-border rounded-md p-2">
                    <div className="space-y-2">
                      {environments
                        .find((e) => e.id === activeEnv)
                        ?.variables.map((variable, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <Input
                              placeholder="KEY"
                              value={variable.key}
                              onChange={(e) => updateVariable(activeEnv, index, "key", e.target.value)}
                              className="flex-1"
                            />
                            <Input
                              placeholder="value"
                              value={variable.value}
                              onChange={(e) => updateVariable(activeEnv, index, "value", e.target.value)}
                              className="flex-1"
                            />
                            <Button variant="ghost" size="icon" onClick={() => deleteVariable(activeEnv, index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select or create an environment
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
