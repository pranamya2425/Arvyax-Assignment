"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, Upload, X, Plus, Loader2, CheckCircle, Clock } from "lucide-react"

interface Session {
  _id?: string
  title: string
  tags: string[]
  jsonUrl: string
  status: "draft" | "published"
}

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id?.[0]

  const [session, setSession] = useState<Session>({
    title: "",
    tags: [],
    jsonUrl: "",
    status: "draft",
  })

  const [newTag, setNewTag] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [error, setError] = useState("")

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()
  const lastSavedRef = useRef<string>("")

  // Load existing session if editing
  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId)
    }
  }, [sessionId])

  // Auto-save logic
  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      const currentData = JSON.stringify(session)
      if (currentData !== lastSavedRef.current && session.title.trim()) {
        autoSave()
      }
    }, 5000) // 5 seconds of inactivity
  }, [session])

  // Periodic auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentData = JSON.stringify(session)
      if (currentData !== lastSavedRef.current && session.title.trim()) {
        autoSave()
      }
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [session])

  // Trigger auto-save on session changes
  useEffect(() => {
    triggerAutoSave()
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [triggerAutoSave])

  const loadSession = async (id: string) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/sessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setSession(data.session)
        lastSavedRef.current = JSON.stringify(data.session)
      } else {
        setError("Session not found")
      }
    } catch (err) {
      setError("Failed to load session")
    } finally {
      setLoading(false)
    }
  }

  const autoSave = async () => {
    if (!session.title.trim()) return

    setAutoSaveStatus("saving")
    try {
      const token = localStorage.getItem("token")
      const url = sessionId ? `/api/sessions/${sessionId}` : "/api/sessions"
      const method = sessionId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(session),
      })

      if (response.ok) {
        const data = await response.json()
        if (!sessionId) {
          // If this was a new session, update the URL
          router.replace(`/editor/${data.session._id}`)
        }
        lastSavedRef.current = JSON.stringify(session)
        setAutoSaveStatus("saved")
        setTimeout(() => setAutoSaveStatus("idle"), 2000)
      }
    } catch (err) {
      setAutoSaveStatus("idle")
    }
  }

  const handleSave = async (publish = false) => {
    if (!session.title.trim()) {
      setError("Title is required")
      return
    }

    setSaving(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const sessionData = { ...session, status: publish ? "published" : "draft" }
      const url = sessionId ? `/api/sessions/${sessionId}` : "/api/sessions"
      const method = sessionId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sessionData),
      })

      if (response.ok) {
        const data = await response.json()
        setSession(data.session)
        lastSavedRef.current = JSON.stringify(data.session)

        if (!sessionId) {
          router.replace(`/editor/${data.session._id}`)
        }

        if (publish) {
          router.push("/dashboard")
        }
      } else {
        const data = await response.json()
        setError(data.error || "Failed to save session")
      }
    } catch (err) {
      setError("Failed to save session")
    } finally {
      setSaving(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !session.tags.includes(newTag.trim())) {
      setSession((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setSession((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{sessionId ? "Edit Session" : "New Session"}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {autoSaveStatus === "saving" && (
                    <>
                      <Clock className="h-3 w-3 animate-pulse" />
                      <span>Auto-saving...</span>
                    </>
                  )}
                  {autoSaveStatus === "saved" && (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Auto-saved</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Draft
              </Button>
              <Button onClick={() => handleSave(true)} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Publish
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Session Title</Label>
                  <Input
                    id="title"
                    value={session.title}
                    onChange={(e) => setSession((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter session title..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="jsonUrl">JSON Content URL</Label>
                  <Textarea
                    id="jsonUrl"
                    value={session.jsonUrl}
                    onChange={(e) => setSession((prev) => ({ ...prev, jsonUrl: e.target.value }))}
                    placeholder="Enter JSON URL or content..."
                    rows={8}
                    className="mt-1 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a URL to your JSON file or paste the JSON content directly
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag..."
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button size="icon" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {session.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-600">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={session.status === "published" ? "default" : "outline"}>{session.status}</Badge>
                <p className="text-sm text-gray-600 mt-2">
                  {session.status === "draft"
                    ? "This session is saved as a draft and not visible to others."
                    : "This session is published and visible to the community."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
