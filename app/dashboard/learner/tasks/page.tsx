"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Loader2, 
  ClipboardList,
  Calendar,
  Clock,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Star,
  Download,
  Send
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Task {
  id: string
  session_id: string
  mentor_id: string
  learner_id: string
  title: string
  description: string
  instructions: string | null
  due_date: string
  max_score: number
  status: string
  submission_text: string | null
  submission_file_url: string | null
  submission_file_name: string | null
  submitted_at: string | null
  score: number | null
  feedback: string | null
  graded_at: string | null
  created_at: string
  session?: {
    topic: string
    date: string
    time: string
  }
  mentor?: {
    name: string
  }
}

export default function LearnerTasksPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksLoading, setTasksLoading] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('all')
  
  // Submission form state
  const [submissionData, setSubmissionData] = useState({
    text: "",
    file: null as File | null
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/')
          return
        }
        setUserData(user)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  useEffect(() => {
    if (userData?.id) {
      fetchTasks()
    }
  }, [userData?.id])

  const fetchTasks = async () => {
    if (!userData?.id) return

    try {
      setTasksLoading(true)
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          session:sessions (
            topic,
            date,
            time
          ),
          mentor:mentors (
            name
          )
        `)
        .eq('learner_id', userData.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to load tasks')
    } finally {
      setTasksLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB')
      return
    }

    setSubmissionData({ ...submissionData, file })
  }

  const handleSubmitTask = async () => {
    if (!selectedTask) return

    if (!submissionData.text.trim() && !submissionData.file) {
      toast.error('Please provide a submission (text or file)')
      return
    }

    setSubmitting(true)
    try {
      let fileUrl = null
      let fileName = null

      // Upload file if provided
      if (submissionData.file) {
        const timestamp = Date.now()
        const fileExtension = submissionData.file.name.split('.').pop()?.toLowerCase() || 'pdf'
        const sanitizedUserId = userData.id.replace(/[^a-zA-Z0-9]/g, '_')
        const fileName_upload = `${sanitizedUserId}_${timestamp}.${fileExtension}`
        const filePath = `task-submissions/${sanitizedUserId}/${fileName_upload}`

        const { error: uploadError } = await supabase.storage
          .from('course-media')
          .upload(filePath, submissionData.file, {
            cacheControl: '3600',
            upsert: false,
            contentType: submissionData.file.type || 'application/octet-stream',
          })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('course-media')
          .getPublicUrl(filePath)

        fileUrl = publicUrl
        fileName = submissionData.file.name
      }

      // Update task with submission
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          submission_text: submissionData.text || null,
          submission_file_url: fileUrl,
          submission_file_name: fileName,
          submitted_at: new Date().toISOString(),
          status: 'submitted'
        })
        .eq('id', selectedTask.id)

      if (updateError) throw updateError

      toast.success('Task submitted successfully!')
      setIsSubmitModalOpen(false)
      setSelectedTask(null)
      setSubmissionData({ text: "", file: null })
      fetchTasks()
    } catch (error: any) {
      console.error('Error submitting task:', error)
      toast.error(error.message || 'Failed to submit task')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string, dueDate: string) => {
    const isOverdue = new Date(dueDate) < new Date() && status !== 'submitted' && status !== 'graded'
    
    if (isOverdue) {
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Overdue
        </Badge>
      )
    }

    switch (status) {
      case 'assigned':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Assigned
          </Badge>
        )
      case 'in_progress':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        )
      case 'submitted':
        return (
          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Submitted
          </Badge>
        )
      case 'graded':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Graded
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredTasks = tasks.filter(task => {
    const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'submitted' && task.status !== 'graded'
    
    switch (activeTab) {
      case 'all':
        return true
      case 'assigned':
        return task.status === 'assigned' || task.status === 'in_progress'
      case 'submitted':
        return task.status === 'submitted'
      case 'graded':
        return task.status === 'graded'
      case 'overdue':
        return isOverdue
      default:
        return true
    }
  })

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="student">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Tasks</h1>
          <p className="text-lg text-gray-600">View and submit your assigned tasks</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
            <TabsTrigger value="assigned">
              Assigned ({tasks.filter(t => t.status === 'assigned' || t.status === 'in_progress').length})
            </TabsTrigger>
            <TabsTrigger value="submitted">
              Submitted ({tasks.filter(t => t.status === 'submitted').length})
            </TabsTrigger>
            <TabsTrigger value="graded">
              Graded ({tasks.filter(t => t.status === 'graded').length})
            </TabsTrigger>
            <TabsTrigger value="overdue">
              Overdue ({tasks.filter(t => {
                const isOverdue = new Date(t.due_date) < new Date() && t.status !== 'submitted' && t.status !== 'graded'
                return isOverdue
              }).length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Tasks List */}
        {tasksLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ClipboardList className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">No tasks found</p>
              <p className="text-sm text-gray-500">Tasks assigned to you will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const dueDate = new Date(task.due_date)
              const isOverdue = dueDate < new Date() && task.status !== 'submitted' && task.status !== 'graded'
              const canSubmit = task.status === 'assigned' || task.status === 'in_progress'
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{task.title}</CardTitle>
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            {getStatusBadge(task.status, task.due_date)}
                            {task.session && (
                              <Badge variant="outline">
                                {task.session.topic}
                              </Badge>
                            )}
                            {task.mentor && (
                              <Badge variant="outline">
                                {task.mentor.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {task.status === 'graded' && task.score !== null && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              {task.score}/{task.max_score}
                            </div>
                            <div className="text-sm text-gray-500">
                              {((task.score / task.max_score) * 100).toFixed(1)}%
                            </div>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{task.description}</p>
                        </div>

                        {task.instructions && (
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs font-semibold text-blue-900 mb-1">Instructions:</p>
                            <p className="text-sm text-blue-800 whitespace-pre-wrap">{task.instructions}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Due: {dueDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>
                              {dueDate.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </span>
                          </div>
                        </div>

                        {task.submission_text && (
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs font-semibold text-gray-700 mb-1">Your Submission:</p>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{task.submission_text}</p>
                            {task.submission_file_url && (
                              <a
                                href={task.submission_file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2"
                              >
                                <Download className="h-3 w-3" />
                                {task.submission_file_name || 'Download file'}
                              </a>
                            )}
                            {task.submitted_at && (
                              <p className="text-xs text-gray-500 mt-2">
                                Submitted: {new Date(task.submitted_at).toLocaleString()}
                              </p>
                            )}
                          </div>
                        )}

                        {task.status === 'graded' && task.feedback && (
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-xs font-semibold text-green-900 mb-1">Feedback:</p>
                            <p className="text-sm text-green-800 whitespace-pre-wrap">{task.feedback}</p>
                            {task.graded_at && (
                              <p className="text-xs text-green-700 mt-2">
                                Graded: {new Date(task.graded_at).toLocaleString()}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2 border-t">
                          {canSubmit && (
                            <Button
                              onClick={() => {
                                setSelectedTask(task)
                                setIsSubmitModalOpen(true)
                              }}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Submit Task
                            </Button>
                          )}
                          {task.status === 'submitted' && (
                            <Badge className="bg-purple-100 text-purple-700">
                              Awaiting Review
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Submit Task Modal */}
        <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Task: {selectedTask?.title}</DialogTitle>
              <DialogDescription>
                Provide your submission below. You can submit text, a file, or both.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="submission_text">Submission Text</Label>
                <Textarea
                  id="submission_text"
                  value={submissionData.text}
                  onChange={(e) => setSubmissionData({ ...submissionData, text: e.target.value })}
                  placeholder="Enter your submission here..."
                  rows={8}
                />
              </div>
              <div>
                <Label htmlFor="submission_file">Upload File (Optional)</Label>
                <Input
                  id="submission_file"
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                />
                {submissionData.file && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {submissionData.file.name} ({(submissionData.file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSubmitModalOpen(false)
                    setSelectedTask(null)
                    setSubmissionData({ text: "", file: null })
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitTask} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

