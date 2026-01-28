import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, LogOut, Search, Filter, TrendingUp, Package, DollarSign, Eye } from 'lucide-react';

interface Listing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  imageUrl: string;
  quality: string;
  grade: string;
  moisture: string;
  color: string;
  size: string;
  defects: string;
  quantity: number;
  availableQuantity: number;
  pricePerKg: number;
  totalValue: number;
  postedDate: string;
  confidence: number;
}

const CompanyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [offerQuantity, setOfferQuantity] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [showOfferModal, setShowOfferModal] = useState(false);

  // Mock data - will be replaced with API calls
  const [listings] = useState<Listing[]>([
    {
      id: '1',
      farmerId: 'F001',
      farmerName: 'Ramesh Patel',
      farmerLocation: 'Rajkot, Gujarat',
      imageUrl: 'https://images.unsplash.com/photo-1599909533555-2e56dc0be6b7?w=400',
      quality: 'Premium',
      grade: 'Grade A',
      moisture: '8.5%',
      color: 'Golden Brown',
      size: 'Large (40-50 count)',
      defects: 'Minimal (<2%)',
      quantity: 10,
      availableQuantity: 10,
      pricePerKg: 65,
      totalValue: 650000,
      postedDate: '2 days ago',
      confidence: 94
    },
    {
      id: '2',
      farmerId: 'F002',
      farmerName: 'Kiran Shah',
      farmerLocation: 'Junagadh, Gujarat',
      imageUrl: 'https://images.unsplash.com/photo-1628773453787-0fddf0a37952?w=400',
      quality: 'Premium',
      grade: 'Grade A',
      moisture: '7.8%',
      color: 'Light Brown',
      size: 'Medium (50-60 count)',
      defects: 'Very Low (<1%)',
      quantity: 15,
      availableQuantity: 12,
      pricePerKg: 62,
      totalValue: 930000,
      postedDate: '1 day ago',
      confidence: 96
    },
    {
      id: '3',
      farmerId: 'F003',
      farmerName: 'Mahesh Gohil',
      farmerLocation: 'Amreli, Gujarat',
      imageUrl: 'https://images.unsplash.com/photo-1582034524815-00c0c0f0dcc1?w=400',
      quality: 'Good',
      grade: 'Grade B',
      moisture: '9.2%',
      color: 'Brown',
      size: 'Mixed Size',
      defects: 'Low (2-3%)',
      quantity: 8,
      availableQuantity: 8,
      pricePerKg: 58,
      totalValue: 464000,
      postedDate: '3 hours ago',
      confidence: 89
    }
  ]);

  const stats = {
    totalListings: listings.length,
    premiumListings: listings.filter(l => l.quality === 'Premium').length,
    avgPrice: Math.round(listings.reduce((sum, l) => sum + l.pricePerKg, 0) / listings.length),
    totalQuantity: listings.reduce((sum, l) => sum + l.availableQuantity, 0)
  };

  const handleMakeOffer = (listing: Listing) => {
    setSelectedListing(listing);
    setOfferQuantity('');
    setOfferPrice(listing.pricePerKg.toString());
    setShowOfferModal(true);
  };

  const submitOffer = () => {
    if (!selectedListing || !offerQuantity || !offerPrice) {
      alert('Please fill all fields');
      return;
    }

    const quantity = parseFloat(offerQuantity);
    if (quantity > selectedListing.availableQuantity) {
      alert(`Maximum available quantity is ${selectedListing.availableQuantity} tonnes`);
      return;
    }

    // TODO: Submit offer to backend
    console.log('Submitting offer:', {
      listingId: selectedListing.id,
      quantity: offerQuantity,
      pricePerKg: offerPrice,
      totalAmount: quantity * parseFloat(offerPrice) * 1000
    });

    alert('Offer submitted successfully! The farmer will be notified.');
    setShowOfferModal(false);
  };

  const filteredListings = listings.filter(listing =>
    listing.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.farmerLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.quality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">SS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Saurashtra Setu</h1>
              <p className="text-sm text-gray-600">Buyer Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">Company Name</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-800">{stats.totalListings}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Available Listings</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">{stats.premiumListings}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Premium Quality</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-800">₹{stats.avgPrice}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Avg Price/kg</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-800">{stats.totalQuantity}T</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Total Available</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by farmer name, location, or quality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filters</span>
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Groundnut Listings</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all hover:border-emerald-500">
                <div className="grid grid-cols-2 gap-4 p-4">
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={listing.imageUrl}
                      alt="Groundnut"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      AI {listing.confidence}%
                    </div>
                  </div>

                  {/* Quality Metrics */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-50 rounded-lg p-2">
                      <p className="text-xs text-gray-600">Quality</p>
                      <p className="font-semibold text-green-700 text-sm">{listing.quality}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-xs text-gray-600">Grade</p>
                      <p className="font-semibold text-blue-700 text-sm">{listing.grade}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2">
                      <p className="text-xs text-gray-600">Moisture</p>
                      <p className="font-semibold text-purple-700 text-sm">{listing.moisture}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-2">
                      <p className="text-xs text-gray-600">Defects</p>
                      <p className="font-semibold text-orange-700 text-sm">{listing.defects}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-2 col-span-2">
                      <p className="text-xs text-gray-600">Size</p>
                      <p className="font-semibold text-yellow-700 text-sm">{listing.size}</p>
                    </div>
                  </div>
                </div>

                {/* Farmer & Price Info */}
                <div className="p-4 border-t-2 border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-800">{listing.farmerName}</p>
                      <p className="text-sm text-gray-600">{listing.farmerLocation}</p>
                      <p className="text-xs text-gray-500 mt-1">Posted {listing.postedDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Price per kg</p>
                      <p className="text-xl font-bold text-emerald-600">₹{listing.pricePerKg}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-600">Available</p>
                      <p className="font-bold text-gray-800">{listing.availableQuantity} / {listing.quantity} tonnes</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-2">
                      <p className="text-xs text-gray-600">Total Value</p>
                      <p className="font-bold text-emerald-700">₹{listing.totalValue.toLocaleString()}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleMakeOffer(listing)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <DollarSign className="w-5 h-5" />
                    Make an Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Offer Modal */}
      {showOfferModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Make an Offer</h3>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600">Farmer: <span className="font-semibold text-gray-800">{selectedListing.farmerName}</span></p>
              <p className="text-sm text-gray-600">Quality: <span className="font-semibold text-green-700">{selectedListing.quality} - {selectedListing.grade}</span></p>
              <p className="text-sm text-gray-600">Available: <span className="font-semibold text-gray-800">{selectedListing.availableQuantity} tonnes</span></p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (tonnes)
                </label>
                <input
                  type="number"
                  value={offerQuantity}
                  onChange={(e) => setOfferQuantity(e.target.value)}
                  placeholder={`Max: ${selectedListing.availableQuantity}`}
                  step="0.1"
                  max={selectedListing.availableQuantity}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Price (₹/kg)
                </label>
                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  placeholder={`Asking: ₹${selectedListing.pricePerKg}`}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              {offerQuantity && offerPrice && (
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
                  <p className="text-sm text-emerald-800 mb-1">Total Offer Amount</p>
                  <p className="text-2xl font-bold text-emerald-900">
                    ₹{(parseFloat(offerQuantity) * parseFloat(offerPrice) * 1000).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowOfferModal(false)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitOffer}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg"
              >
                Submit Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;
