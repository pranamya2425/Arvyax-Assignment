import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Users, BookOpen, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">WellnessFlow</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Create & Share Your Wellness Journey</h2>
          <p className="text-xl text-gray-600 mb-8">
            Design, manage, and publish your yoga and meditation sessions with our intuitive platform. Auto-save ensures
            your work is never lost.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Start Creating</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sessions">Browse Sessions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <BookOpen className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Session Editor</CardTitle>
              <CardDescription>
                Create detailed wellness sessions with titles, tags, and structured content
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Auto-Save</CardTitle>
              <CardDescription>Never lose your work with intelligent auto-save after 5s of inactivity</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Share & Publish</CardTitle>
              <CardDescription>Publish your sessions to share with the wellness community</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  )
}
