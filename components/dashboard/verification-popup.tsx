import * as React from "react"
import { X, Upload, FileText, Building2, MapPin, Phone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface VerificationPopupProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  userId: string
}

export function VerificationPopup({ isOpen, onClose, onSubmit, userId }: VerificationPopupProps) {
  const [step, setStep] = React.useState(1)
  const [formData, setFormData] = React.useState({
    companyName: "",
    registrationNumber: "",
    address: "",
    phone: "",
    documents: {
      businessRegistration: null,
      idDocument: null,
      proofOfAddress: null
    }
  })

  const handleFileChange = (documentType: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [documentType]: e.target.files![0]
        }
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Popup Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-lg max-h-[80vh] overflow-y-auto bg-[#0f1424] border border-[#2a2e45] rounded-xl p-6 z-50 shadow-2xl mx-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Account Verification</h2>
              <p className="text-gray-400 text-sm">Complete the verification process to unlock all features</p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-[#6B54FA] text-white' : 'bg-[#1a1e32] text-gray-400'
                }`}>1</div>
                <div className={`w-16 h-0.5 ${
                  step > 1 ? 'bg-[#6B54FA]' : 'bg-[#1a1e32]'
                }`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-[#6B54FA] text-white' : 'bg-[#1a1e32] text-gray-400'
                }`}>2</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 ? (
                /* Step 1: Business Information */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                        className="w-full bg-[#1a1e32] border border-[#2a2e45] rounded-lg py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#6B54FA]"
                        placeholder="Enter company name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Registration Number</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.registrationNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                        className="w-full bg-[#1a1e32] border border-[#2a2e45] rounded-lg py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#6B54FA]"
                        placeholder="Enter registration number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Business Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full bg-[#1a1e32] border border-[#2a2e45] rounded-lg py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#6B54FA]"
                        placeholder="Enter business address"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-[#1a1e32] border border-[#2a2e45] rounded-lg py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#6B54FA]"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-[#6B54FA] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#5844c8] transition-colors"
                  >
                    Next Step
                  </button>
                </div>
              ) : (
                /* Step 2: Document Upload */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Business Registration Document</label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileChange('businessRegistration')}
                        className="hidden"
                        id="business-registration"
                        accept=".pdf,.doc,.docx"
                        required
                      />
                      <label
                        htmlFor="business-registration"
                        className="flex items-center justify-center w-full bg-[#1a1e32] border border-dashed border-[#2a2e45] rounded-lg p-4 cursor-pointer hover:border-[#6B54FA] transition-colors group"
                      >
                        <div className="text-center">
                          <Upload className="h-6 w-6 text-gray-400 group-hover:text-[#6B54FA] mx-auto mb-2" />
                          <span className="text-sm text-gray-400 group-hover:text-white">
                            {formData.documents.businessRegistration
                              ? formData.documents.businessRegistration.name
                              : "Upload business registration"}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1">ID Document</label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileChange('idDocument')}
                        className="hidden"
                        id="id-document"
                        accept=".pdf,.jpg,.jpeg,.png"
                        required
                      />
                      <label
                        htmlFor="id-document"
                        className="flex items-center justify-center w-full bg-[#1a1e32] border border-dashed border-[#2a2e45] rounded-lg p-4 cursor-pointer hover:border-[#6B54FA] transition-colors group"
                      >
                        <div className="text-center">
                          <Upload className="h-6 w-6 text-gray-400 group-hover:text-[#6B54FA] mx-auto mb-2" />
                          <span className="text-sm text-gray-400 group-hover:text-white">
                            {formData.documents.idDocument
                              ? formData.documents.idDocument.name
                              : "Upload ID document"}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Proof of Address</label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileChange('proofOfAddress')}
                        className="hidden"
                        id="proof-of-address"
                        accept=".pdf,.jpg,.jpeg,.png"
                        required
                      />
                      <label
                        htmlFor="proof-of-address"
                        className="flex items-center justify-center w-full bg-[#1a1e32] border border-dashed border-[#2a2e45] rounded-lg p-4 cursor-pointer hover:border-[#6B54FA] transition-colors group"
                      >
                        <div className="text-center">
                          <Upload className="h-6 w-6 text-gray-400 group-hover:text-[#6B54FA] mx-auto mb-2" />
                          <span className="text-sm text-gray-400 group-hover:text-white">
                            {formData.documents.proofOfAddress
                              ? formData.documents.proofOfAddress.name
                              : "Upload proof of address"}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-[#1a1e32] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#2a2e45] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#6B54FA] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#5844c8] transition-colors"
                    >
                      Submit Verification
                    </button>
                  </div>
                </div>
              )}
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 