"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Leaf, Plus, Search, MoreVertical, Edit, Trash2, Eye, LogOut, User } from "lucide-react"

interface Session {
  _id: string
  title: string
  tags: string[]
  jsonUrl: string
  status: "draft" | "published"
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
    fetchSessions()
  }, [router])

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/sessions/my-sessions", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions)
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const deleteSession = async (sessionId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setSessions(sessions.filter((s) => s._id !== sessionId))
      }
    } catch (error) {
      console.error("Failed to delete session:", error)
    }
  }

  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const draftSessions = filteredSessions.filter((s) => s.status === "draft")
  const publishedSessions = filteredSessions.filter((s) => s.status === "published")

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your sessions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">WellnessFlow</h1>
          </Link>

          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/editor">
                <Plus className="mr-2 h-4 w-4" />
                New Session
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>{user?.name}</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-gray-600">Manage your wellness sessions</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Sessions Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Sessions ({sessions.length})</TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({draftSessions.length})</TabsTrigger>
            <TabsTrigger value="published">Published ({publishedSessions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <SessionGrid sessions={filteredSessions} onDelete={deleteSession} />
          </TabsContent>

          <TabsContent value="drafts">
            <SessionGrid sessions={draftSessions} onDelete={deleteSession} />
          </TabsContent>

          <TabsContent value="published">
            <SessionGrid sessions={publishedSessions} onDelete={deleteSession} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function SessionGrid({ sessions, onDelete }: { sessions: Session[]; onDelete: (id: string) => void }) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
        <p className="text-gray-600 mb-4">Create your first wellness session to get started</p>
        <Button asChild>
          <Link href="/editor">
            <Plus className="mr-2 h-4 w-4" />
            Create Session
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map((session) => (
        <Card key={session._id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg line-clamp-2">{session.title}</CardTitle>
                <CardDescription className="mt-1">
                  Updated {new Date(session.updatedAt).toLocaleDateString()}
                </CardDescription>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/editor/${session._id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  {session.status === "published" && (
                    <DropdownMenuItem asChild>
                      <Link href={`/sessions/${session._id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onDelete(session._id)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {session.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {session.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{session.tags.length - 2}
                  </Badge>
                )}
              </div>

              <Badge variant={session.status === "published" ? "default" : "outline"}>{session.status}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
