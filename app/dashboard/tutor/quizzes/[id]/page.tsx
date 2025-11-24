"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Loader2, 
  ArrowLeft,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  FileText,
  Eye,
  Image as ImageIcon,
  Upload
} from "lucide-react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
}

interface Question {
  id: string
  question_text: string
  question_type: string
  points: number
  order_index: number
  options: string[] | null
  correct_answer: string
  explanation: string | null
  image_url: string | null
}

export default function QuizDetailPage() {
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string
  
  const [userData, setUserData] = useState<any>(null)
  const [mentorData, setMentorData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isTestMode, setIsTestMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null) // in seconds
  const [testStarted, setTestStarted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    time_limit: "",
    passing_score: "60",
    max_attempts: "1",
    due_date: ""
  })
  const [formQuestions, setFormQuestions] = useState<any[]>([])

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
    if (quizId && mentorData?.id) {
      fetchQuiz()
    }
  }, [quizId, mentorData?.id])

  const fetchQuiz = async () => {
    try {
      // Fetch quiz
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .eq('mentor_id', mentorData.id)
        .single()

      if (quizError) throw quizError
      setQuiz(quizData)

      // Set form data
      setFormData({
        title: quizData.title || "",
        description: quizData.description || "",
        instructions: quizData.instructions || "",
        time_limit: quizData.time_limit?.toString() || "",
        passing_score: quizData.passing_score?.toString() || "60",
        max_attempts: quizData.max_attempts?.toString() || "1",
        due_date: quizData.due_date ? new Date(quizData.due_date).toISOString().slice(0, 16) : ""
      })

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index', { ascending: true })

      if (questionsError) throw questionsError
      setQuestions(questionsData || [])
      
      // Set form questions for editing
      const formattedQuestions = (questionsData || []).map(q => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        points: q.points,
        order_index: q.order_index,
        options: q.options || (q.question_type === 'multiple_choice' ? ["", "", "", ""] : []),
        correct_answer: q.correct_answer,
        explanation: q.explanation || ""
      }))
      setFormQuestions(formattedQuestions)
    } catch (error: any) {
      console.error('Error fetching quiz:', error)
      toast.error('Failed to load quiz')
      router.push('/dashboard/tutor/quizzes')
    }
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a quiz title')
      return
    }

    if (formQuestions.length === 0) {
      toast.error('Please add at least one question')
      return
    }

    // Validate questions
    for (let i = 0; i < formQuestions.length; i++) {
      const q = formQuestions[i]
      if (!q.question_text.trim()) {
        toast.error(`Question ${i + 1} is missing text`)
        return
      }
      if (q.question_type === 'multiple_choice' && (!q.correct_answer || (q.options?.filter((o: string) => o.trim()).length || 0) < 2)) {
        toast.error(`Question ${i + 1} needs at least 2 options and a correct answer`)
        return
      }
      if (!q.correct_answer.trim()) {
        toast.error(`Question ${i + 1} needs a correct answer`)
        return
      }
    }

    if (!mentorData?.id || !quiz) {
      toast.error('Mentor data not found')
      return
    }

    setSaving(true)
    try {
      // Update quiz
      const { error: quizError } = await supabase
        .from('quizzes')
        .update({
          title: formData.title,
          description: formData.description || null,
          instructions: formData.instructions || null,
          time_limit: formData.time_limit ? parseInt(formData.time_limit) : null,
          passing_score: parseFloat(formData.passing_score) || 60,
          max_attempts: parseInt(formData.max_attempts) || 1,
          due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null
        })
        .eq('id', quiz.id)

      if (quizError) throw quizError

      // Delete existing questions
      const { error: deleteError } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('quiz_id', quiz.id)

      if (deleteError) throw deleteError

      // Insert updated questions
      const questionsToInsert = formQuestions.map(q => ({
        quiz_id: quiz.id,
        question_text: q.question_text,
        question_type: q.question_type,
        points: q.points,
        order_index: q.order_index,
        options: q.question_type === 'multiple_choice' ? q.options.filter((o: string) => o.trim()) : null,
        correct_answer: q.correct_answer,
        explanation: q.explanation || null,
        image_url: q.image_url || null
      }))

      const { error: questionsError } = await supabase
        .from('quiz_questions')
        .insert(questionsToInsert)

      if (questionsError) throw questionsError

      toast.success('Quiz updated successfully!')
      setIsEditing(false)
      fetchQuiz()
    } catch (error: any) {
      console.error('Error updating quiz:', error)
      toast.error(error.message || 'Failed to update quiz')
    } finally {
      setSaving(false)
    }
  }

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updated = [...formQuestions]
    updated[index] = { ...updated[index], [field]: value }
    setFormQuestions(updated)
  }

  const handleAddQuestion = () => {
    setFormQuestions([...formQuestions, {
      question_text: "",
      question_type: "multiple_choice",
      points: 1,
      order_index: formQuestions.length + 1,
      options: ["", "", "", ""],
      correct_answer: "",
      explanation: "",
      image_url: null
    }])
  }

  const handleImageUpload = async (questionIndex: number, file: File) => {
    if (!mentorData?.id) return

    try {
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const sanitizedMentorId = String(mentorData.id).replace(/[^a-zA-Z0-9]/g, '_')
      const fileName = `${sanitizedMentorId}_q${questionIndex}_${timestamp}.${fileExtension}`
      const filePath = `quiz-images/${sanitizedMentorId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('course-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'image/jpeg',
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('course-media')
        .getPublicUrl(filePath)

      handleQuestionChange(questionIndex, 'image_url', publicUrl)
      toast.success('Image uploaded successfully!')
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    }
  }

  const handleRemoveQuestion = (index: number) => {
    setFormQuestions(formQuestions.filter((_, i) => i !== index).map((q, i) => ({ ...q, order_index: i + 1 })))
  }

  // Timer effect for test mode
  useEffect(() => {
    if (isTestMode && quiz?.time_limit && !testStarted) {
      // Initialize timer when test mode starts
      const initialTime = quiz.time_limit * 60 // Convert minutes to seconds
      setTimeRemaining(initialTime)
      setTestStarted(true)
      setShowResults(false)
      setTestResults(null)
    }
  }, [isTestMode, quiz?.time_limit, testStarted])

  // Countdown timer
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0 && isTestMode && !showResults) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer)
            // Auto-submit when time runs out - calculate results inline
            if (quiz) {
              let correctCount = 0
              let totalPoints = 0
              let earnedPoints = 0
              const questionResults: any[] = []

              questions.forEach((q) => {
                const userAnswer = testAnswers[q.id] || ''
                const isCorrect = userAnswer.trim().toLowerCase() === q.correct_answer.trim().toLowerCase()
                totalPoints += q.points
                
                if (isCorrect) {
                  correctCount++
                  earnedPoints += q.points
                }

                questionResults.push({
                  questionId: q.id,
                  questionText: q.question_text,
                  userAnswer: userAnswer || '(No answer provided)',
                  correctAnswer: q.correct_answer,
                  isCorrect,
                  points: q.points,
                  earnedPoints: isCorrect ? q.points : 0,
                  explanation: q.explanation
                })
              })

              const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0
              const passed = percentage >= quiz.passing_score

              setTestResults({
                correctCount,
                totalQuestions: questions.length,
                earnedPoints,
                totalPoints,
                percentage: percentage.toFixed(1),
                passed,
                questionResults,
                timeTaken: quiz.time_limit ? (quiz.time_limit * 60) - 0 : 0
              })

              setShowResults(true)
              toast.warning('Time is up! Your quiz has been automatically submitted.')
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [timeRemaining, isTestMode, showResults, quiz, questions, testAnswers])

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Handle check answers
  const handleCheckAnswers = (autoSubmit = false) => {
    let correctCount = 0
    let totalPoints = 0
    let earnedPoints = 0
    const questionResults: any[] = []

    questions.forEach((q) => {
      const userAnswer = testAnswers[q.id] || ''
      const isCorrect = userAnswer.trim().toLowerCase() === q.correct_answer.trim().toLowerCase()
      totalPoints += q.points
      
      if (isCorrect) {
        correctCount++
        earnedPoints += q.points
      }

      questionResults.push({
        questionId: q.id,
        questionText: q.question_text,
        userAnswer: userAnswer || '(No answer provided)',
        correctAnswer: q.correct_answer,
        isCorrect,
        points: q.points,
        earnedPoints: isCorrect ? q.points : 0,
        explanation: q.explanation
      })
    })

    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0
    const passed = percentage >= quiz.passing_score

    setTestResults({
      correctCount,
      totalQuestions: questions.length,
      earnedPoints,
      totalPoints,
      percentage: percentage.toFixed(1),
      passed,
      questionResults,
      timeTaken: quiz.time_limit ? (quiz.time_limit * 60) - (timeRemaining || 0) : 0
    })

    setShowResults(true)
    if (timeRemaining !== null) {
      setTimeRemaining(null) // Stop timer
    }

    if (autoSubmit) {
      toast.warning('Time is up! Your quiz has been automatically submitted.')
    } else {
      toast.success(`Quiz submitted! Score: ${earnedPoints}/${totalPoints} points (${percentage.toFixed(1)}%)`)
    }
  }

  // Reset test mode
  const resetTestMode = () => {
    setIsTestMode(false)
    setTestAnswers({})
    setTimeRemaining(null)
    setTestStarted(false)
    setShowResults(false)
    setTestResults(null)
  }

  if (loading || !quiz) {
    return (
      <DashboardLayout role="mentor">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  const displayQuestions = isEditing ? formQuestions : questions
  const totalPoints = displayQuestions.reduce((sum, q) => sum + (q.points || 0), 0)

  return (
    <DashboardLayout role="mentor">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/tutor/quizzes')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quizzes
          </Button>
          {!isEditing && !isTestMode && (
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsTestMode(true)} 
                className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              >
                <Eye className="h-4 w-4" />
                Test Quiz
              </Button>
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Quiz
              </Button>
            </div>
          )}
          {isTestMode && (
            <Button 
              onClick={resetTestMode} 
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Exit Test Mode
            </Button>
          )}
        </div>

        {isTestMode ? (
          /* Test Mode View */
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-white border-2 border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-purple-200">
                <CardTitle className="text-2xl font-bold text-gray-900">{quiz.title}</CardTitle>
                {quiz.description && (
                  <CardDescription className="text-base text-gray-700 font-medium">{quiz.description}</CardDescription>
                )}
                {quiz.instructions && (
                  <div className="mt-4 p-4 bg-white rounded-xl border-2 border-purple-200">
                    <p className="text-sm font-bold text-purple-900 mb-2 uppercase tracking-wide">Instructions:</p>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{quiz.instructions}</p>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-6">
                {/* Timer Display */}
                {quiz.time_limit && timeRemaining !== null && !showResults && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-2 border-red-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="h-6 w-6 text-red-600" />
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Time Remaining</p>
                          <p className={`text-3xl font-bold mt-1 ${timeRemaining < 60 ? 'text-red-600 animate-pulse' : 'text-gray-900'}`}>
                            {formatTime(timeRemaining)}
                          </p>
                        </div>
                      </div>
                      {timeRemaining < 300 && (
                        <Badge className="bg-red-100 text-red-700 border-red-300">
                          {timeRemaining < 60 ? 'Less than 1 minute!' : 'Less than 5 minutes!'}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {quiz.time_limit && (
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs text-gray-600 font-semibold uppercase">Time Limit</p>
                      <p className="text-lg font-bold text-purple-700 mt-1">{quiz.time_limit} minutes</p>
                    </div>
                  )}
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-xs text-gray-600 font-semibold uppercase">Passing Score</p>
                    <p className="text-lg font-bold text-purple-700 mt-1">{quiz.passing_score}%</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-xs text-gray-600 font-semibold uppercase">Max Attempts</p>
                    <p className="text-lg font-bold text-purple-700 mt-1">{quiz.max_attempts}</p>
                  </div>
                  {quiz.due_date && (
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs text-gray-600 font-semibold uppercase">Due Date</p>
                      <p className="text-sm font-bold text-purple-700 mt-1">
                        {new Date(quiz.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-white border-2 border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-purple-200">
                <CardTitle className="text-xl font-bold text-gray-900">Questions ({questions.length})</CardTitle>
                <CardDescription className="text-gray-700 font-semibold">Total Points: {totalPoints}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {questions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-2 border-purple-200 rounded-xl p-5 bg-white shadow-md"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 font-semibold px-3 py-1">
                        Question {index + 1}
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-700 border-purple-300 font-semibold">
                        {question.points} point{question.points !== 1 ? 's' : ''}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <p className="text-lg font-bold text-gray-900">{question.question_text}</p>
                      
                      {question.image_url && (
                        <div className="my-4">
                          <img 
                            src={question.image_url} 
                            alt="Question diagram" 
                            className="max-w-full h-auto rounded-lg border-2 border-purple-200 shadow-sm"
                          />
                        </div>
                      )}

                      {question.question_type === 'multiple_choice' && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option: string, optIndex: number) => (
                            <label
                              key={optIndex}
                              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                testAnswers[question.id] === option
                                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-400 shadow-md'
                                  : 'bg-white border-purple-200 hover:border-purple-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={option}
                                checked={testAnswers[question.id] === option}
                                onChange={(e) => setTestAnswers({ ...testAnswers, [question.id]: e.target.value })}
                                className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="flex-1 font-medium text-gray-800">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {question.question_type === 'true_false' && (
                        <div className="space-y-2">
                          {['True', 'False'].map((option) => (
                            <label
                              key={option}
                              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                testAnswers[question.id] === option
                                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-400 shadow-md'
                                  : 'bg-white border-purple-200 hover:border-purple-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={option}
                                checked={testAnswers[question.id] === option}
                                onChange={(e) => setTestAnswers({ ...testAnswers, [question.id]: e.target.value })}
                                className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="flex-1 font-medium text-gray-800">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {question.question_type === 'short_answer' && (
                        <Input
                          value={testAnswers[question.id] || ''}
                          onChange={(e) => setTestAnswers({ ...testAnswers, [question.id]: e.target.value })}
                          placeholder="Enter your answer"
                          className="border-purple-200 focus:border-purple-400"
                        />
                      )}
                    </div>
                  </motion.div>
                ))}

                {!showResults ? (
                  <div className="flex justify-end gap-3 pt-6 border-t-2 border-purple-200">
                    <Button
                      variant="outline"
                      onClick={resetTestMode}
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleCheckAnswers(false)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Check Answers
                    </Button>
                  </div>
                ) : testResults && (
                  <div className="pt-6 border-t-2 border-purple-200 space-y-6">
                    {/* Results Summary */}
                    <div className={`p-6 rounded-xl border-2 ${
                      testResults.passed 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
                        : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">Quiz Results</h3>
                        <Badge className={`${
                          testResults.passed 
                            ? 'bg-green-100 text-green-700 border-green-300' 
                            : 'bg-red-100 text-red-700 border-red-300'
                        } text-lg px-4 py-2`}>
                          {testResults.passed ? 'PASSED' : 'FAILED'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 font-semibold uppercase">Score</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {testResults.earnedPoints}/{testResults.totalPoints}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-semibold uppercase">Percentage</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{testResults.percentage}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-semibold uppercase">Correct</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {testResults.correctCount}/{testResults.totalQuestions}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-semibold uppercase">Time Taken</p>
                          <p className="text-lg font-bold text-gray-900 mt-1">
                            {Math.floor(testResults.timeTaken / 60)}:{(testResults.timeTaken % 60).toString().padStart(2, '0')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Results */}
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-gray-900">Question Review</h4>
                      {testResults.questionResults.map((result: any, index: number) => {
                        const question = questions.find(q => q.id === result.questionId)
                        return (
                          <div
                            key={result.questionId}
                            className={`p-5 rounded-xl border-2 ${
                              result.isCorrect
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Badge className={`${
                                  result.isCorrect
                                    ? 'bg-green-100 text-green-700 border-green-300'
                                    : 'bg-red-100 text-red-700 border-red-300'
                                }`}>
                                  Question {index + 1}
                                </Badge>
                                <Badge variant="outline">
                                  {result.earnedPoints}/{result.points} points
                                </Badge>
                              </div>
                              {result.isCorrect ? (
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                              ) : (
                                <X className="h-6 w-6 text-red-600" />
                              )}
                            </div>
                            <p className="font-semibold text-gray-900 mb-3">{result.questionText}</p>
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-semibold text-gray-700">Your Answer:</p>
                                <p className={`p-2 rounded ${
                                  result.isCorrect
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {result.userAnswer}
                                </p>
                              </div>
                              {!result.isCorrect && (
                                <div>
                                  <p className="text-sm font-semibold text-gray-700">Correct Answer:</p>
                                  <p className="p-2 rounded bg-green-100 text-green-800">
                                    {result.correctAnswer}
                                  </p>
                                </div>
                              )}
                              {result.explanation && (
                                <div>
                                  <p className="text-sm font-semibold text-gray-700">Explanation:</p>
                                  <p className="p-2 rounded bg-blue-50 text-blue-800">
                                    {result.explanation}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        onClick={resetTestMode}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
        {/* Quiz Info Card */}
        <Card className="mb-6 bg-gradient-to-br from-pink-50 via-rose-50 to-white border-2 border-pink-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 border-b-2 border-pink-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="text-2xl font-bold mb-2 bg-white border-pink-200 focus:border-pink-400"
                  />
                ) : (
                  <CardTitle className="text-2xl mb-2 text-gray-900 font-bold">{quiz.title}</CardTitle>
                )}
                {isEditing ? (
                  <Textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description"
                    rows={2}
                    className="mb-2 bg-white border-pink-200 focus:border-pink-400"
                  />
                ) : (
                  quiz.description && (
                    <CardDescription className="text-base text-gray-700 font-medium">{quiz.description}</CardDescription>
                  )
                )}
              </div>
              <Badge className={`${quiz.is_published ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300' : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-300'} border-2 px-4 py-1.5 font-semibold text-sm`}>
                {quiz.is_published ? 'Published' : 'Draft'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl border-2 border-pink-200 shadow-sm">
                <Label className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Time Limit</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={formData.time_limit}
                    onChange={(e) => setFormData({ ...formData, time_limit: e.target.value })}
                    placeholder="No limit"
                    min="1"
                    className="mt-2 bg-white border-pink-200 focus:border-pink-400"
                  />
                ) : (
                  <p className="text-lg font-bold text-pink-700 mt-2">
                    {quiz.time_limit ? `${quiz.time_limit} minutes` : 'No limit'}
                  </p>
                )}
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl border-2 border-pink-200 shadow-sm">
                <Label className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Passing Score</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={formData.passing_score}
                    onChange={(e) => setFormData({ ...formData, passing_score: e.target.value })}
                    min="0"
                    max="100"
                    step="0.01"
                    className="mt-2 bg-white border-pink-200 focus:border-pink-400"
                  />
                ) : (
                  <p className="text-lg font-bold text-pink-700 mt-2">{quiz.passing_score}%</p>
                )}
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl border-2 border-pink-200 shadow-sm">
                <Label className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Max Attempts</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={formData.max_attempts}
                    onChange={(e) => setFormData({ ...formData, max_attempts: e.target.value })}
                    min="1"
                    className="mt-2 bg-white border-pink-200 focus:border-pink-400"
                  />
                ) : (
                  <p className="text-lg font-bold text-pink-700 mt-2">{quiz.max_attempts}</p>
                )}
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl border-2 border-pink-200 shadow-sm">
                <Label className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Due Date</Label>
                {isEditing ? (
                  <Input
                    type="datetime-local"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="mt-2 bg-white border-pink-200 focus:border-pink-400"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900 mt-2">
                    {quiz.due_date 
                      ? new Date(quiz.due_date).toLocaleString()
                      : 'No due date'
                    }
                  </p>
                )}
              </div>
            </div>
            {isEditing && (
              <div className="mb-4 p-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl border-2 border-pink-200">
                <Label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Instructions</Label>
                <Textarea
                  value={formData.instructions || ""}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Enter instructions for students"
                  rows={3}
                  className="mt-2 bg-white border-pink-200 focus:border-pink-400"
                />
              </div>
            )}
            {!isEditing && quiz.instructions && (
              <div className="p-5 bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl border-2 border-pink-200 shadow-sm">
                <p className="text-xs font-bold text-pink-900 mb-3 uppercase tracking-wide">Instructions:</p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap font-medium leading-relaxed">{quiz.instructions}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Questions Section */}
        <Card className="bg-gradient-to-br from-pink-50 via-rose-50 to-white border-2 border-pink-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 border-b-2 border-pink-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 font-bold text-xl">Questions ({displayQuestions.length})</CardTitle>
                <CardDescription className="text-gray-700 font-semibold mt-1">Total Points: {totalPoints}</CardDescription>
              </div>
              {isEditing && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddQuestion} 
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 hover:from-pink-600 hover:to-rose-600 shadow-md"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <div className="space-y-6">
              {displayQuestions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No questions yet</p>
                </div>
              ) : (
                displayQuestions.map((question, index) => (
                  <motion.div
                    key={question.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-2 border-pink-200 rounded-xl p-5 bg-gradient-to-br from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 transition-all shadow-md hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 font-semibold px-3 py-1">
                          Question {index + 1}
                        </Badge>
                        <Badge className="bg-gradient-to-r from-pink-200 to-rose-200 text-pink-700 border-pink-300 font-semibold">
                          {question.points} point{question.points !== 1 ? 's' : ''}
                        </Badge>
                        <Badge className="bg-white text-pink-600 border-pink-300 capitalize font-semibold">
                          {question.question_type.replace('_', ' ')}
                        </Badge>
                      </div>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveQuestion(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-white rounded-xl border-2 border-pink-200 shadow-sm">
                          <Label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Question Text *</Label>
                          <Textarea
                            value={question.question_text}
                            onChange={(e) => handleQuestionChange(index, 'question_text', e.target.value)}
                            rows={2}
                            className="mt-2 bg-white border-pink-200 focus:border-pink-400"
                          />
                        </div>
                        <div className="p-4 bg-white rounded-xl border-2 border-pink-200 shadow-sm">
                          <Label className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2 block">Question Image/Diagram (Optional)</Label>
                          {question.image_url ? (
                            <div className="space-y-2">
                              <img 
                                src={question.image_url} 
                                alt="Question image" 
                                className="max-w-full h-auto max-h-64 rounded-lg border-2 border-pink-200"
                              />
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const input = document.createElement('input')
                                    input.type = 'file'
                                    input.accept = 'image/*'
                                    input.onchange = (e: any) => {
                                      const file = e.target.files?.[0]
                                      if (file) {
                                        if (file.size > 10 * 1024 * 1024) {
                                          toast.error('Image size must be less than 10MB')
                                          return
                                        }
                                        handleImageUpload(index, file)
                                      }
                                    }
                                    input.click()
                                  }}
                                  className="bg-white border-pink-300 hover:bg-pink-50"
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Replace Image
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuestionChange(index, 'image_url', null)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const input = document.createElement('input')
                                input.type = 'file'
                                input.accept = 'image/*'
                                input.onchange = (e: any) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    if (file.size > 10 * 1024 * 1024) {
                                      toast.error('Image size must be less than 10MB')
                                      return
                                    }
                                    handleImageUpload(index, file)
                                  }
                                }
                                input.click()
                              }}
                              className="bg-white border-pink-300 hover:bg-pink-50"
                            >
                              <ImageIcon className="h-4 w-4 mr-2" />
                              Upload Image
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white rounded-xl border-2 border-pink-200 shadow-sm">
                            <Label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Type</Label>
                            <Select
                              value={question.question_type}
                              onValueChange={(value) => handleQuestionChange(index, 'question_type', value)}
                            >
                              <SelectTrigger className="mt-2 bg-white border-pink-200 focus:border-pink-400">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                <SelectItem value="true_false">True/False</SelectItem>
                                <SelectItem value="short_answer">Short Answer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="p-4 bg-white rounded-xl border-2 border-pink-200 shadow-sm">
                            <Label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Points</Label>
                            <Input
                              type="number"
                              value={question.points}
                              onChange={(e) => handleQuestionChange(index, 'points', parseFloat(e.target.value) || 1)}
                              min="0.5"
                              step="0.5"
                              className="mt-2 bg-white border-pink-200 focus:border-pink-400"
                            />
                          </div>
                        </div>
                        {question.question_type === 'multiple_choice' && (
                          <div className="p-4 bg-white rounded-xl border-2 border-pink-200 shadow-sm">
                            <Label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Options *</Label>
                            <div className="space-y-2 mt-3">
                              {(question.options || []).map((option: string, optIndex: number) => (
                                <div key={optIndex} className="flex gap-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...(question.options || [])]
                                      newOptions[optIndex] = e.target.value
                                      handleQuestionChange(index, 'options', newOptions)
                                    }}
                                    placeholder={`Option ${optIndex + 1}`}
                                    className="bg-white border-pink-200 focus:border-pink-400"
                                  />
                                  {optIndex < 4 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const newOptions = (question.options || []).filter((_, i) => i !== optIndex)
                                        handleQuestionChange(index, 'options', newOptions)
                                      }}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                handleQuestionChange(index, 'options', [...(question.options || []), ''])
                              }}
                              className="mt-3 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border-pink-300 hover:from-pink-200 hover:to-rose-200 font-semibold"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Option
                            </Button>
                          </div>
                        )}
                        <div className="p-4 bg-white rounded-xl border-2 border-pink-200 shadow-sm">
                          <Label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Correct Answer *</Label>
                          {question.question_type === 'multiple_choice' ? (
                            <Select
                              value={question.correct_answer}
                              onValueChange={(value) => handleQuestionChange(index, 'correct_answer', value)}
                            >
                              <SelectTrigger className="mt-2 bg-white border-pink-200 focus:border-pink-400">
                                <SelectValue placeholder="Select correct answer" />
                              </SelectTrigger>
                              <SelectContent>
                                {(question.options || []).filter((o: string) => o.trim()).map((opt: string, i: number) => (
                                  <SelectItem key={i} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : question.question_type === 'true_false' ? (
                            <Select
                              value={question.correct_answer}
                              onValueChange={(value) => handleQuestionChange(index, 'correct_answer', value)}
                            >
                              <SelectTrigger className="mt-2 bg-white border-pink-200 focus:border-pink-400">
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
                              className="mt-2 bg-white border-pink-200 focus:border-pink-400"
                            />
                          )}
                        </div>
                        <div className="p-4 bg-white rounded-xl border-2 border-pink-200 shadow-sm">
                          <Label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Explanation</Label>
                          <Textarea
                            value={question.explanation || ""}
                            onChange={(e) => handleQuestionChange(index, 'explanation', e.target.value)}
                            placeholder="Explain why this is the correct answer"
                            rows={2}
                            className="mt-2 bg-white border-pink-200 focus:border-pink-400"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-lg font-bold text-gray-900 leading-relaxed">{question.question_text}</p>
                        {question.image_url && (
                          <div className="my-4">
                            <img 
                              src={question.image_url} 
                              alt="Question diagram" 
                              className="max-w-full h-auto rounded-xl border-2 border-pink-200 shadow-md"
                            />
                          </div>
                        )}
                        {question.question_type === 'multiple_choice' && question.options && (
                          <div className="space-y-3">
                            {question.options.map((option: string, optIndex: number) => (
                              <div
                                key={optIndex}
                                className={`p-4 rounded-xl border-2 transition-all ${
                                  option === question.correct_answer
                                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 shadow-md'
                                    : 'bg-white border-pink-200 hover:border-pink-300'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {option === question.correct_answer && (
                                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                      <CheckCircle2 className="h-4 w-4 text-white" />
                                    </div>
                                  )}
                                  {option !== question.correct_answer && (
                                    <div className="w-6 h-6 rounded-full border-2 border-pink-300 flex-shrink-0"></div>
                                  )}
                                  <span className={option === question.correct_answer ? 'font-bold text-green-800 text-base' : 'text-gray-700 font-medium'}>
                                    {option}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {question.question_type === 'true_false' && (
                          <div className="p-4 rounded-xl border-2 bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 shadow-md">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                              <span className="font-bold text-green-800 text-base">Correct Answer: {question.correct_answer}</span>
                            </div>
                          </div>
                        )}
                        {question.question_type === 'short_answer' && (
                          <div className="p-4 rounded-xl border-2 bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 shadow-md">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                              <span className="font-bold text-green-800 text-base">Correct Answer: {question.correct_answer}</span>
                            </div>
                          </div>
                        )}
                        {question.explanation && (
                          <div className="p-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl border-2 border-pink-200 shadow-sm">
                            <p className="text-xs font-bold text-pink-900 mb-2 uppercase tracking-wide">Explanation:</p>
                            <p className="text-sm text-gray-800 font-medium leading-relaxed">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t-2 border-pink-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    fetchQuiz()
                  }}
                  disabled={saving}
                  className="border-pink-300 text-pink-700 hover:bg-pink-50 font-semibold"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 hover:from-pink-600 hover:to-rose-600 shadow-md hover:shadow-lg font-semibold"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

