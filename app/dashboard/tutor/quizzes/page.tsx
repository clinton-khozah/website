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
  Plus,
  ClipboardList,
  Share2,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  ArrowRight,
  Clock,
  FileText,
  Upload,
  FileCheck
} from "lucide-react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Quiz {
  id: string
  mentor_id: number
  session_id: string | null
  title: string
  description: string | null
  instructions: string | null
  time_limit: number | null
  passing_score: number
  max_attempts: number
  due_date: string | null
  is_published: boolean
  created_at: string
  questions_count?: number
}

interface Question {
  id?: string
  question_text: string
  question_type: string
  points: number
  order_index: number
  options: string[]
  correct_answer: string
  explanation: string
}

interface Assessment {
  id: string
  mentor_id: number
  session_id: string | null
  title: string
  description: string | null
  instructions: string | null
  document_url: string
  document_name: string
  document_type: string | null
  document_size: number | null
  due_date: string | null
  max_score: number | null
  is_published: boolean
  created_at: string
}

export default function QuizzesPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [mentorData, setMentorData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [quizzesLoading, setQuizzesLoading] = useState(false)
  const [assessmentsLoading, setAssessmentsLoading] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreateAssessmentModalOpen, setIsCreateAssessmentModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [students, setStudents] = useState<any[]>([])
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [sharing, setSharing] = useState(false)
  const [activeTab, setActiveTab] = useState("quizzes")
  
  // Form state for quizzes
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    time_limit: "",
    passing_score: "60",
    max_attempts: "1",
    due_date: "",
    session_id: ""
  })
  const [questions, setQuestions] = useState<Question[]>([])

  // Form state for assessments
  const [assessmentFormData, setAssessmentFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    due_date: "",
    max_score: "",
    session_id: ""
  })
  const [assessmentDocument, setAssessmentDocument] = useState<File | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/')
          return
        }

        const { data: mentor, error: mentorError } = await supabase
          .from('mentors')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (mentorError || !mentor) {
          console.error('Mentor data not found:', mentorError)
          router.push('/dashboard')
          return
        }
        setUserData(user)
        setMentorData(mentor)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  useEffect(() => {
    if (mentorData?.id) {
      fetchQuizzes()
      fetchAssessments()
    }
  }, [mentorData?.id])

  const fetchQuizzes = async () => {
    if (!mentorData?.id) return

    try {
      setQuizzesLoading(true)
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          *,
          questions:quiz_questions (id)
        `)
        .eq('mentor_id', mentorData.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Add questions count
      const quizzesWithCount = (data || []).map((quiz: any) => ({
        ...quiz,
        questions_count: Array.isArray(quiz.questions) ? quiz.questions.length : 0
      }))
      
      setQuizzes(quizzesWithCount)
    } catch (error) {
      console.error('Error fetching quizzes:', error)
      toast.error('Failed to load quizzes')
    } finally {
      setQuizzesLoading(false)
    }
  }

  const fetchAssessments = async () => {
    if (!mentorData?.id) return

    try {
      setAssessmentsLoading(true)
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('mentor_id', mentorData.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAssessments(data || [])
    } catch (error) {
      console.error('Error fetching assessments:', error)
      toast.error('Failed to load assessments')
    } finally {
      setAssessmentsLoading(false)
    }
  }

  const fetchPaidStudents = async () => {
    if (!mentorData?.id) return

    try {
      setStudentsLoading(true)
      const { data: sessionsData, error } = await supabase
        .from('sessions')
        .select(`
          learner_email,
          learner_name,
          id,
          topic,
          payments!inner (
            status
          )
        `)
        .eq('mentor_id', mentorData.id)
        .eq('payments.status', 'succeeded')
        .not('learner_email', 'is', null)
        .neq('learner_name', 'TBD')

      if (error) throw error

      const uniqueStudents = new Map()
      sessionsData?.forEach((session: any) => {
        if (session.learner_email && !uniqueStudents.has(session.learner_email)) {
          uniqueStudents.set(session.learner_email, {
            email: session.learner_email,
            name: session.learner_name,
            session_id: session.id,
            session_topic: session.topic
          })
        }
      })

      setStudents(Array.from(uniqueStudents.values()))
    } catch (error: any) {
      console.error('Error fetching students:', error)
      toast.error('Failed to load students')
    } finally {
      setStudentsLoading(false)
    }
  }

  const handleAddQuestion = () => {
    setQuestions([...questions, {
      question_text: "",
      question_type: "multiple_choice",
      points: 1,
      order_index: questions.length + 1,
      options: ["", "", "", ""],
      correct_answer: "",
      explanation: ""
    }])
  }

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, order_index: i + 1 })))
  }

  const handleSaveQuiz = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a quiz title')
      return
    }

    if (questions.length === 0) {
      toast.error('Please add at least one question')
      return
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question_text.trim()) {
        toast.error(`Question ${i + 1} is missing text`)
        return
      }
      if (q.question_type === 'multiple_choice' && (!q.correct_answer || q.options.filter(o => o.trim()).length < 2)) {
        toast.error(`Question ${i + 1} needs at least 2 options and a correct answer`)
        return
      }
      if (!q.correct_answer.trim()) {
        toast.error(`Question ${i + 1} needs a correct answer`)
        return
      }
    }

    if (!mentorData?.id) {
      toast.error('Mentor data not found')
      return
    }

    setSaving(true)
    try {
      // Create quiz
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          mentor_id: mentorData.id,
          session_id: formData.session_id || null,
          title: formData.title,
          description: formData.description || null,
          instructions: formData.instructions || null,
          time_limit: formData.time_limit ? parseInt(formData.time_limit) : null,
          passing_score: parseFloat(formData.passing_score) || 60,
          max_attempts: parseInt(formData.max_attempts) || 1,
          due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
          is_published: false
        })
        .select()
        .single()

      if (quizError) throw quizError

      // Create questions
      const questionsToInsert = questions.map(q => ({
        quiz_id: quizData.id,
        question_text: q.question_text,
        question_type: q.question_type,
        points: q.points,
        order_index: q.order_index,
        options: q.question_type === 'multiple_choice' ? q.options.filter(o => o.trim()) : null,
        correct_answer: q.correct_answer,
        explanation: q.explanation || null
      }))

      const { error: questionsError } = await supabase
        .from('quiz_questions')
        .insert(questionsToInsert)

      if (questionsError) throw questionsError

      toast.success('Quiz created successfully!')
      setIsCreateModalOpen(false)
      setFormData({
        title: "",
        description: "",
        instructions: "",
        time_limit: "",
        passing_score: "60",
        max_attempts: "1",
        due_date: "",
        session_id: ""
      })
      setQuestions([])
      fetchQuizzes()
    } catch (error: any) {
      console.error('Error creating quiz:', error)
      toast.error(error.message || 'Failed to create quiz')
    } finally {
      setSaving(false)
    }
  }

  const handleOpenShareModal = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setIsShareModalOpen(true)
    fetchPaidStudents()
    setSelectedStudents([])
  }

  const handleShare = async () => {
    if (!selectedQuiz || selectedStudents.length === 0) {
      toast.error('Please select at least one student')
      return
    }

    if (!mentorData?.id) {
      toast.error('Mentor data not found')
      return
    }

    setSharing(true)
    try {
      const studentEmails = students
        .filter(s => selectedStudents.includes(s.email))
        .map(s => s.email)

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email')
        .in('email', studentEmails)

      if (usersError) throw usersError

      // Create share records using email (learner_id can be null and updated later)
      const shareRecords = selectedStudents.map(email => {
        const student = students.find(s => s.email === email)
        return {
          quiz_id: selectedQuiz.id,
          learner_id: null, // Will be updated when student logs in
          learner_email: email,
          shared_by: mentorData.id,
          session_id: student?.session_id || null
        }
      })

      if (shareRecords.length > 0) {
        const { error: shareError } = await supabase
          .from('shared_quizzes')
          .upsert(shareRecords, { onConflict: 'quiz_id,learner_id' })

        if (shareError) throw shareError
      }

      toast.success(`Quiz shared with ${selectedStudents.length} student(s)!`)
      setIsShareModalOpen(false)
      setSelectedQuiz(null)
      setSelectedStudents([])
    } catch (error: any) {
      console.error('Error sharing quiz:', error)
      toast.error(error.message || 'Failed to share quiz')
    } finally {
      setSharing(false)
    }
  }

  const handleCreateAssessment = async () => {
    if (!assessmentFormData.title.trim()) {
      toast.error('Please enter an assessment title')
      return
    }

    if (!assessmentDocument) {
      toast.error('Please upload a document')
      return
    }

    if (!mentorData?.id) {
      toast.error('Mentor data not found')
      return
    }

    setUploading(true)
    try {
      // Upload document to Supabase Storage
      const timestamp = Date.now()
      const fileExtension = assessmentDocument.name.split('.').pop()?.toLowerCase() || 'pdf'
      const sanitizedMentorId = String(mentorData.id).replace(/[^a-zA-Z0-9]/g, '_')
      const fileName = `${sanitizedMentorId}_assessment_${timestamp}.${fileExtension}`
      const filePath = `assessments/${sanitizedMentorId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('course-media')
        .upload(filePath, assessmentDocument, {
          cacheControl: '3600',
          upsert: false,
          contentType: assessmentDocument.type || 'application/pdf',
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('course-media')
        .getPublicUrl(filePath)

      // Create assessment record
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .insert({
          mentor_id: mentorData.id,
          session_id: assessmentFormData.session_id || null,
          title: assessmentFormData.title,
          description: assessmentFormData.description || null,
          instructions: assessmentFormData.instructions || null,
          document_url: publicUrl,
          document_name: assessmentDocument.name,
          document_type: assessmentDocument.type || 'application/pdf',
          document_size: assessmentDocument.size,
          due_date: assessmentFormData.due_date ? new Date(assessmentFormData.due_date).toISOString() : null,
          max_score: assessmentFormData.max_score ? parseFloat(assessmentFormData.max_score) : null,
          is_published: false
        })
        .select()
        .single()

      if (assessmentError) throw assessmentError

      toast.success('Assessment created successfully!')
      setIsCreateAssessmentModalOpen(false)
      setAssessmentFormData({
        title: "",
        description: "",
        instructions: "",
        due_date: "",
        max_score: "",
        session_id: ""
      })
      setAssessmentDocument(null)
      fetchAssessments()
    } catch (error: any) {
      console.error('Error creating assessment:', error)
      toast.error(error.message || 'Failed to create assessment')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="mentor">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="mentor">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Quizzes & Assessments</h1>
            <p className="text-lg text-gray-600">Create and manage quizzes and assessments for your students</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCreateAssessmentModalOpen} onOpenChange={setIsCreateAssessmentModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FileCheck className="h-4 w-4" />
                  Create Assessment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Assessment</DialogTitle>
                  <DialogDescription>
                    Upload a document and set details for your assessment
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="assessment-title">Assessment Title *</Label>
                    <Input
                      id="assessment-title"
                      value={assessmentFormData.title}
                      onChange={(e) => setAssessmentFormData({ ...assessmentFormData, title: e.target.value })}
                      placeholder="Enter assessment title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="assessment-description">Description</Label>
                    <Textarea
                      id="assessment-description"
                      value={assessmentFormData.description}
                      onChange={(e) => setAssessmentFormData({ ...assessmentFormData, description: e.target.value })}
                      placeholder="Enter assessment description"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="assessment-instructions">Instructions</Label>
                    <Textarea
                      id="assessment-instructions"
                      value={assessmentFormData.instructions}
                      onChange={(e) => setAssessmentFormData({ ...assessmentFormData, instructions: e.target.value })}
                      placeholder="Enter instructions for students"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="assessment-due-date">Due Date</Label>
                      <Input
                        id="assessment-due-date"
                        type="datetime-local"
                        value={assessmentFormData.due_date}
                        onChange={(e) => setAssessmentFormData({ ...assessmentFormData, due_date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="assessment-max-score">Max Score</Label>
                      <Input
                        id="assessment-max-score"
                        type="number"
                        value={assessmentFormData.max_score}
                        onChange={(e) => setAssessmentFormData({ ...assessmentFormData, max_score: e.target.value })}
                        placeholder="Optional"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="assessment-document">Document *</Label>
                    <div className="mt-2">
                      <Input
                        id="assessment-document"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            if (file.size > 50 * 1024 * 1024) {
                              toast.error('File size must be less than 50MB')
                              return
                            }
                            setAssessmentDocument(file)
                          }
                        }}
                        className="cursor-pointer"
                      />
                      {assessmentDocument && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium">{assessmentDocument.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(assessmentDocument.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreateAssessmentModalOpen(false)
                        setAssessmentFormData({
                          title: "",
                          description: "",
                          instructions: "",
                          due_date: "",
                          max_score: "",
                          session_id: ""
                        })
                        setAssessmentDocument(null)
                      }}
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAssessment} disabled={uploading}>
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Create Assessment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Quiz
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Quiz</DialogTitle>
                <DialogDescription>
                  Create a quiz or assessment for your students
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Quiz Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter quiz title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter quiz description"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    placeholder="Enter instructions for students"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="time_limit">Time Limit (minutes)</Label>
                    <Input
                      id="time_limit"
                      type="number"
                      value={formData.time_limit}
                      onChange={(e) => setFormData({ ...formData, time_limit: e.target.value })}
                      placeholder="No limit"
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="passing_score">Passing Score (%)</Label>
                    <Input
                      id="passing_score"
                      type="number"
                      value={formData.passing_score}
                      onChange={(e) => setFormData({ ...formData, passing_score: e.target.value })}
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_attempts">Max Attempts</Label>
                    <Input
                      id="max_attempts"
                      type="number"
                      value={formData.max_attempts}
                      onChange={(e) => setFormData({ ...formData, max_attempts: e.target.value })}
                      min="1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="datetime-local"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>

                {/* Questions Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-lg font-semibold">Questions ({questions.length})</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddQuestion}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {questions.map((question, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold">Question {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveQuestion(index)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <Label>Question Text *</Label>
                            <Textarea
                              value={question.question_text}
                              onChange={(e) => handleQuestionChange(index, 'question_text', e.target.value)}
                              placeholder="Enter question"
                              rows={2}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Type</Label>
                              <Select
                                value={question.question_type}
                                onValueChange={(value) => handleQuestionChange(index, 'question_type', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                  <SelectItem value="true_false">True/False</SelectItem>
                                  <SelectItem value="short_answer">Short Answer</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Points</Label>
                              <Input
                                type="number"
                                value={question.points}
                                onChange={(e) => handleQuestionChange(index, 'points', parseFloat(e.target.value) || 1)}
                                min="0.5"
                                step="0.5"
                              />
                            </div>
                          </div>
                          {question.question_type === 'multiple_choice' && (
                            <div>
                              <Label>Options *</Label>
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex gap-2 mb-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...question.options]
                                      newOptions[optIndex] = e.target.value
                                      handleQuestionChange(index, 'options', newOptions)
                                    }}
                                    placeholder={`Option ${optIndex + 1}`}
                                  />
                                  {optIndex < 4 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const newOptions = question.options.filter((_, i) => i !== optIndex)
                                        handleQuestionChange(index, 'options', newOptions)
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  handleQuestionChange(index, 'options', [...question.options, ''])
                                }}
                                className="mt-2"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Option
                              </Button>
                            </div>
                          )}
                          <div>
                            <Label>Correct Answer *</Label>
                            {question.question_type === 'multiple_choice' ? (
                              <Select
                                value={question.correct_answer}
                                onValueChange={(value) => handleQuestionChange(index, 'correct_answer', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select correct answer" />
                                </SelectTrigger>
                                <SelectContent>
                                  {question.options.filter(o => o.trim()).map((opt, i) => (
                                    <SelectItem key={i} value={opt}>{opt}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : question.question_type === 'true_false' ? (
                              <Select
                                value={question.correct_answer}
                                onValueChange={(value) => handleQuestionChange(index, 'correct_answer', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select answer" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="True">True</SelectItem>
                                  <SelectItem value="False">False</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                value={question.correct_answer}
                                onChange={(e) => handleQuestionChange(index, 'correct_answer', e.target.value)}
                                placeholder="Enter correct answer"
                              />
                            )}
                          </div>
                          <div>
                            <Label>Explanation (shown after submission)</Label>
                            <Textarea
                              value={question.explanation}
                              onChange={(e) => handleQuestionChange(index, 'explanation', e.target.value)}
                              placeholder="Explain why this is the correct answer"
                              rows={2}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateModalOpen(false)
                      setFormData({
                        title: "",
                        description: "",
                        instructions: "",
                        time_limit: "",
                        passing_score: "60",
                        max_attempts: "1",
                        session_id: ""
                      })
                      setQuestions([])
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveQuiz} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Create Quiz
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        </div>

        {/* Tabs for Quizzes and Assessments */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
          </TabsList>

          <TabsContent value="quizzes" className="mt-6">
        {/* Quizzes List */}
        {quizzesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : quizzes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ClipboardList className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">No quizzes yet</p>
              <p className="text-sm text-gray-500 mb-4">Create your first quiz to get started</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-2 border-pink-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-pink-300 transition-all bg-gradient-to-br from-pink-50 via-rose-50 to-white shadow-md"
              >
                <Card className="h-full flex flex-col bg-transparent border-0 shadow-none">
                  <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 border-b-2 border-pink-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2 text-gray-900 font-bold">{quiz.title}</CardTitle>
                        {quiz.description && (
                          <CardDescription className="line-clamp-2 text-gray-700 text-sm">
                            {quiz.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-md">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col bg-white p-5">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-800 bg-gradient-to-r from-pink-100 to-rose-100 px-4 py-2.5 rounded-xl border border-pink-200 shadow-sm">
                        <ClipboardList className="h-4 w-4 text-pink-600" />
                        <span className="font-semibold">{quiz.questions_count || 0} questions</span>
                      </div>
                      {quiz.time_limit && (
                        <div className="flex items-center gap-2 text-sm text-gray-800 bg-gradient-to-r from-pink-100 to-rose-100 px-4 py-2.5 rounded-xl border border-pink-200 shadow-sm">
                          <Clock className="h-4 w-4 text-pink-600" />
                          <span className="font-semibold">{quiz.time_limit} minutes</span>
                        </div>
                      )}
                      <Badge className={`${quiz.is_published ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300' : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-300'} border-2 px-3 py-1 font-semibold`}>
                        {quiz.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <div className="text-sm mb-4 space-y-2 bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl border border-pink-200">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700">Passing:</span>
                        <span className="text-pink-600 font-bold">{quiz.passing_score}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700">Max attempts:</span>
                        <span className="text-pink-600 font-bold">{quiz.max_attempts}</span>
                      </div>
                      {quiz.due_date && (
                        <div className="flex items-center gap-2 mt-3 p-2.5 bg-white rounded-lg border border-pink-200">
                          <Clock className="h-4 w-4 text-pink-600" />
                          <span className="font-medium text-gray-700">Due: {new Date(quiz.due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      <p className="text-gray-500 text-xs mt-2 pt-2 border-t border-pink-200">
                        Created: {new Date(quiz.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenShareModal(quiz)}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 hover:from-pink-600 hover:to-rose-600 shadow-md hover:shadow-lg transition-all"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/tutor/quizzes/${quiz.id}`)}
                        className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border-pink-300 hover:from-pink-200 hover:to-rose-200 shadow-sm"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
          </TabsContent>

          <TabsContent value="assessments" className="mt-6">
        {/* Assessments List */}
        {assessmentsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : assessments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileCheck className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">No assessments yet</p>
              <p className="text-sm text-gray-500 mb-4">Create your first assessment to get started</p>
              <Button onClick={() => setIsCreateAssessmentModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Assessment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((assessment) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-2 border-blue-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all bg-gradient-to-br from-blue-50 via-indigo-50 to-white shadow-md"
              >
                <Card className="h-full flex flex-col bg-transparent border-0 shadow-none">
                  <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b-2 border-blue-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2 text-gray-900 font-bold">{assessment.title}</CardTitle>
                        {assessment.description && (
                          <CardDescription className="line-clamp-2 text-gray-700 text-sm">
                            {assessment.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-md">
                        <FileCheck className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col bg-white p-5">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-800 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2.5 rounded-xl border border-blue-200 shadow-sm">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold truncate">{assessment.document_name}</span>
                      </div>
                      {assessment.document_size && (
                        <div className="flex items-center gap-2 text-sm text-gray-800 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2.5 rounded-xl border border-blue-200 shadow-sm">
                          <span className="font-semibold">
                            {(assessment.document_size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      )}
                      <Badge className={`${assessment.is_published ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300' : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-300'} border-2 px-3 py-1 font-semibold`}>
                        {assessment.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <div className="text-sm mb-4 space-y-2 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                      {assessment.max_score && (
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-700">Max Score:</span>
                          <span className="text-blue-600 font-bold">{assessment.max_score}</span>
                        </div>
                      )}
                      {assessment.due_date && (
                        <div className="flex items-center gap-2 mt-3 p-2.5 bg-white rounded-lg border border-blue-200">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-gray-700">
                            Due: {new Date(assessment.due_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <p className="text-gray-500 text-xs mt-2 pt-2 border-t border-blue-200">
                        Created: {new Date(assessment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(assessment.document_url, '_blank')}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 hover:from-blue-600 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
          </TabsContent>
        </Tabs>

        {/* Share Quiz Modal */}
        <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Share Quiz: {selectedQuiz?.title}</DialogTitle>
              <DialogDescription>
                Select students who have paid for sessions to share this quiz with
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {studentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No students found</p>
                  <p className="text-sm text-gray-500">Students who have paid for sessions will appear here</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {students.map((student) => (
                    <div
                      key={student.email}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedStudents.includes(student.email)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedStudents(prev =>
                          prev.includes(student.email)
                            ? prev.filter(e => e !== student.email)
                            : [...prev, student.email]
                        )
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {student.name?.charAt(0)?.toUpperCase() || 'S'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.email}</p>
                            {student.session_topic && (
                              <p className="text-xs text-gray-500 mt-1">Session: {student.session_topic}</p>
                            )}
                          </div>
                        </div>
                        {selectedStudents.includes(student.email) && (
                          <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsShareModalOpen(false)
                    setSelectedQuiz(null)
                    setSelectedStudents([])
                  }}
                  disabled={sharing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleShare}
                  disabled={sharing || selectedStudents.length === 0}
                >
                  {sharing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share with {selectedStudents.length} student(s)
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

