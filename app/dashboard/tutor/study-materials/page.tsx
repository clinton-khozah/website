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
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Plus,
  Search,
  Filter,
  FolderOpen,
  Eye,
  X,
  CheckCircle2,
  Share2,
  User,
  Mail,
  Calendar
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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StudyMaterial {
  id: string
  mentor_id: string
  title: string
  description: string | null
  file_url: string | null
  file_name: string | null
  file_type: string | null
  file_size: number | null
  category: string | null
  tags: string[] | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export default function StudyMaterialsPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [mentorData, setMentorData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [materials, setMaterials] = useState<StudyMaterial[]>([])
  const [materialsLoading, setMaterialsLoading] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null)
  const [students, setStudents] = useState<any[]>([])
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [sharing, setSharing] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    is_public: false,
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
      fetchMaterials()
    }
  }, [mentorData?.id])

  const fetchMaterials = async () => {
    if (!mentorData?.id) return

    try {
      setMaterialsLoading(true)
      const { data, error } = await supabase
        .from('study_materials')
        .select('*')
        .eq('mentor_id', mentorData.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMaterials(data || [])
    } catch (error) {
      console.error('Error fetching materials:', error)
      toast.error('Failed to load study materials')
    } finally {
      setMaterialsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB')
      return
    }

    setFormData({ ...formData, file })
  }

  const handleUpload = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title')
      return
    }

    if (!formData.file) {
      toast.error('Please select a file')
      return
    }

    if (!mentorData?.id) {
      toast.error('Mentor data not found')
      return
    }

    setUploading(true)
    try {
      // Upload file to Supabase Storage
      const timestamp = Date.now()
      const fileExtension = formData.file.name.split('.').pop()?.toLowerCase() || 'pdf'
      const sanitizedMentorId = String(mentorData.id).replace(/[^a-zA-Z0-9]/g, '_')
      const fileName = `${sanitizedMentorId}_${timestamp}.${fileExtension}`
      const filePath = `study-materials/${sanitizedMentorId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('course-media')
        .upload(filePath, formData.file, {
          cacheControl: '3600',
          upsert: false,
          contentType: formData.file.type || 'application/octet-stream',
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('course-media')
        .getPublicUrl(filePath)

      // Parse tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      // Save to database
      const { error: dbError } = await supabase
        .from('study_materials')
        .insert({
          mentor_id: mentorData.id,
          title: formData.title,
          description: formData.description || null,
          file_url: publicUrl,
          file_name: formData.file.name,
          file_type: formData.file.type || fileExtension,
          file_size: formData.file.size,
          category: formData.category || null,
          tags: tags.length > 0 ? tags : null,
          is_public: formData.is_public,
        })

      if (dbError) throw dbError

      toast.success('Study material uploaded successfully!')
      setIsUploadModalOpen(false)
      setFormData({
        title: "",
        description: "",
        category: "",
        tags: "",
        is_public: false,
        file: null
      })
      fetchMaterials()
    } catch (error: any) {
      console.error('Error uploading material:', error)
      toast.error(error.message || 'Failed to upload study material')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (materialId: string, fileUrl: string | null) => {
    if (!confirm('Are you sure you want to delete this material?')) return

    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('study_materials')
        .delete()
        .eq('id', materialId)

      if (dbError) throw dbError

      // Optionally delete file from storage (if needed)
      // Note: This would require extracting the file path from the URL

      toast.success('Study material deleted successfully!')
      fetchMaterials()
    } catch (error: any) {
      console.error('Error deleting material:', error)
      toast.error('Failed to delete study material')
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const getFileIcon = (fileType: string | null) => {
    if (!fileType) return <FileText className="h-5 w-5 text-white" />
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-white" />
    if (fileType.includes('image')) return <Eye className="h-5 w-5 text-white" />
    if (fileType.includes('video')) return <FolderOpen className="h-5 w-5 text-white" />
    return <FileText className="h-5 w-5 text-white" />
  }

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(materials.map(m => m.category).filter(Boolean)))

  const handleOpenShareModal = (material: StudyMaterial) => {
    setSelectedMaterial(material)
    setIsShareModalOpen(true)
    fetchPaidStudents()
    setSelectedStudents([])
  }

  const handleShare = async () => {
    if (!selectedMaterial || selectedStudents.length === 0) {
      toast.error('Please select at least one student')
      return
    }

    if (!mentorData?.id) {
      toast.error('Mentor data not found')
      return
    }

    setSharing(true)
    try {
      // Create share records using email (learner_id can be null and updated later)
      const shareRecords = selectedStudents.map(email => {
        const student = students.find(s => s.email === email)
        return {
          material_id: selectedMaterial.id,
          learner_id: null, // Will be updated when student logs in
          learner_email: email,
          shared_by: mentorData.id,
          session_id: student?.session_id || null
        }
      })

      if (shareRecords.length > 0) {
        const { error: shareError } = await supabase
          .from('shared_materials')
          .upsert(shareRecords, { onConflict: 'material_id,learner_email' })

        if (shareError) throw shareError
      }

      toast.success(`Material shared with ${selectedStudents.length} student(s)!`)
      setIsShareModalOpen(false)
      setSelectedMaterial(null)
      setSelectedStudents([])
    } catch (error: any) {
      console.error('Error sharing material:', error)
      toast.error(error.message || 'Failed to share material')
    } finally {
      setSharing(false)
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Study Materials</h1>
            <p className="text-lg text-gray-600">Upload and manage your study materials</p>
          </div>
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Upload Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Study Material</DialogTitle>
                <DialogDescription>
                  Upload a file to add to your study materials library
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter material title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter material description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Lecture Notes, Assignments"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="e.g., math, algebra, beginner"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="file">File *</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.mp4,.mp3"
                  />
                  {formData.file && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_public"
                    checked={formData.is_public}
                    onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="is_public">Make this material public (shareable with students)</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsUploadModalOpen(false)}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpload} disabled={uploading}>
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat || ''}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Materials Grid */}
        {materialsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredMaterials.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">No study materials yet</p>
              <p className="text-sm text-gray-500 mb-4">Upload your first study material to get started</p>
              <Button onClick={() => setIsUploadModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Upload Material
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-2 border-pink-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-pink-300 transition-all bg-gradient-to-br from-pink-50 via-rose-50 to-white shadow-md"
              >
                <Card className="h-full flex flex-col bg-transparent border-0 shadow-none">
                  <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 border-b-2 border-pink-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2 text-gray-900 font-bold">{material.title}</CardTitle>
                        {material.description && (
                          <CardDescription className="line-clamp-2 text-gray-700 text-sm">
                            {material.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-md">
                        {getFileIcon(material.file_type)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col bg-white p-5">
                    <div className="space-y-3 mb-4">
                      {material.category && (
                        <div className="flex items-center gap-2 text-sm text-gray-800 bg-gradient-to-r from-pink-100 to-rose-100 px-4 py-2.5 rounded-xl border border-pink-200 shadow-sm">
                          <FolderOpen className="h-4 w-4 text-pink-600" />
                          <span className="font-semibold">{material.category}</span>
                        </div>
                      )}
                      {material.is_public && (
                        <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300 border-2 px-3 py-1 font-semibold">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Public
                        </Badge>
                      )}
                    </div>
                    {material.tags && material.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {material.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border-pink-300 text-xs font-medium">
                            {tag}
                          </Badge>
                        ))}
                        {material.tags.length > 3 && (
                          <Badge className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border-pink-300 text-xs font-medium">
                            +{material.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="text-sm mb-4 space-y-2 bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl border border-pink-200">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700">Size:</span>
                        <span className="text-pink-600 font-bold">{formatFileSize(material.file_size)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3 p-2.5 bg-white rounded-lg border border-pink-200">
                        <Calendar className="h-4 w-4 text-pink-600" />
                        <span className="font-medium text-gray-700">{new Date(material.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      {material.file_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(material.file_url || '', '_blank')}
                          className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border-pink-300 hover:from-pink-200 hover:to-rose-200 shadow-sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleOpenShareModal(material)}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 hover:from-pink-600 hover:to-rose-600 shadow-md hover:shadow-lg transition-all"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(material.id, material.file_url)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Share Material Modal */}
        <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Share Material: {selectedMaterial?.title}</DialogTitle>
              <DialogDescription>
                Select students who have paid for sessions to share this material with
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {studentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {student.email}
                            </p>
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
                    setSelectedMaterial(null)
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

