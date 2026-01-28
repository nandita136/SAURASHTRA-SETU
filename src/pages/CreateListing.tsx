import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, Sparkles, ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface AIAnalysis {
  quality: string;
  grade: string;
  moisture: string;
  color: string;
  size: string;
  defects: string;
  recommendedRate: number;
  confidence: number;
}

const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [quantity, setQuantity] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setAnalyzing(true);
    
    // Simulate AI analysis - in production, this would call an actual AI service
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock AI analysis results
    const mockAnalysis: AIAnalysis = {
      quality: 'Premium',
      grade: 'Grade A',
      moisture: '8.5%',
      color: 'Golden Brown',
      size: 'Large (40-50 count)',
      defects: 'Minimal (<2%)',
      recommendedRate: 65,
      confidence: 94
    };
    
    setAiAnalysis(mockAnalysis);
    setAnalyzing(false);
    setSellingPrice(mockAnalysis.recommendedRate.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!selectedImage) {
        alert('Please upload a groundnut image');
        return;
      }
      analyzeImage();
      setStep(2);
    } else if (step === 2) {
      if (!quantity || !sellingPrice) {
        alert('Please fill in all fields');
        return;
      }
      
      // TODO: Submit to backend
      console.log('Creating listing:', {
        image: selectedImage,
        analysis: aiAnalysis,
        quantity,
        sellingPrice
      });
      
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/farmer/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-2">
            Create New Listing
          </h1>
          <p className="text-gray-600">
            Upload groundnut photos for AI quality analysis
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                {step > 1 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <span className="font-medium">Upload Photo</span>
            </div>
            <div className="h-0.5 w-16 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                {step > 2 ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <span className="font-medium">AI Analysis</span>
            </div>
            <div className="h-0.5 w-16 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                3
              </div>
              <span className="font-medium">Confirm</span>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {/* Step 1: Upload Photo */}
          {step === 1 && (
            <form onSubmit={handleSubmit}>
              <div className="text-center">
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:border-green-500 transition-colors">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Upload Groundnut Photo
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Take a clear photo of your groundnut produce for AI analysis
                    </p>
                    <label className="inline-block cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <span className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg inline-flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Choose Photo
                      </span>
                    </label>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6">
                      <img
                        src={imagePreview}
                        alt="Groundnut preview"
                        className="max-w-full max-h-96 mx-auto rounded-xl shadow-lg"
                      />
                    </div>
                    <div className="flex gap-4 justify-center">
                      <label className="cursor-pointer px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        Change Photo
                      </label>
                      <button
                        type="submit"
                        className="px-8 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg inline-flex items-center gap-2"
                      >
                        Continue
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          )}

          {/* Step 2: AI Analysis & Pricing */}
          {step === 2 && (
            <div>
              {analyzing ? (
                <div className="text-center py-12">
                  <div className="inline-block relative">
                    <Sparkles className="w-16 h-16 text-green-600 animate-pulse" />
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
                    Analyzing Groundnut Quality...
                  </h3>
                  <p className="text-gray-600">
                    Our AI is examining moisture content, color, size, and defects
                  </p>
                  <div className="mt-8 max-w-md mx-auto">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full animate-pulse w-3/4"></div>
                    </div>
                  </div>
                </div>
              ) : aiAnalysis ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-bold text-gray-800">AI Quality Certificate</h3>
                      <span className="ml-auto bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {aiAnalysis.confidence}% Confidence
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">Quality</p>
                        <p className="font-bold text-green-700">{aiAnalysis.quality}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">Grade</p>
                        <p className="font-bold text-green-700">{aiAnalysis.grade}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">Moisture</p>
                        <p className="font-bold text-blue-700">{aiAnalysis.moisture}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">Color</p>
                        <p className="font-bold text-yellow-700">{aiAnalysis.color}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">Size</p>
                        <p className="font-bold text-purple-700">{aiAnalysis.size}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">Defects</p>
                        <p className="font-bold text-orange-700">{aiAnalysis.defects}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Quantity (in tonnes)
                      </label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="e.g., 10"
                        step="0.1"
                        required
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selling Price (₹/kg)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={sellingPrice}
                          onChange={(e) => setSellingPrice(e.target.value)}
                          placeholder="e.g., 65"
                          required
                          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all bg-gray-50 focus:bg-white"
                        />
                        <div className="absolute top-3 right-4 text-sm text-gray-500">
                          Recommended: ₹{aiAnalysis.recommendedRate}
                        </div>
                      </div>
                    </div>
                  </div>

                  {quantity && sellingPrice && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800 mb-1">Total Listing Value</p>
                      <p className="text-2xl font-bold text-blue-900">
                        ₹{(parseFloat(quantity) * parseFloat(sellingPrice) * 1000).toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        {quantity} tonnes × ₹{sellingPrice}/kg
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg inline-flex items-center justify-center gap-2"
                    >
                      Create Listing
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              ) : null}
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-12">
              <div className="inline-block relative mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Listing Created Successfully!
              </h3>
              <p className="text-gray-600 mb-8">
                Your groundnut listing is now live. Companies can start making offers.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/farmer/create-listing')}
                  className="px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                >
                  Create Another
                </button>
                <button
                  onClick={() => navigate('/farmer/dashboard')}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateListing;
