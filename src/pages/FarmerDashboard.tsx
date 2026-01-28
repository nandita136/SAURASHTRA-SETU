import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, TrendingUp, DollarSign, LogOut, User } from 'lucide-react';

interface Listing {
  id: string;
  imageUrl: string;
  quality: string;
  moisture: string;
  rate: string;
  quantity: number;
  price: number;
  status: 'active' | 'sold' | 'pending';
  offers: number;
  createdAt: string;
}

const FarmerDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock data - will be replaced with API calls
  const [listings, setListings] = useState<Listing[]>([
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1599909533555-2e56dc0be6b7?w=400',
      quality: 'Grade A',
      moisture: '8.5%',
      rate: '₹65/kg',
      quantity: 10,
      price: 650000,
      status: 'active',
      offers: 3,
      createdAt: '2 days ago'
    }
  ]);

  const stats = {
    totalListings: listings.length,
    activeListings: listings.filter(l => l.status === 'active').length,
    totalOffers: listings.reduce((sum, l) => sum + l.offers, 0),
    totalEarnings: 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">SS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Saurashtra Setu</h1>
              <p className="text-sm text-gray-600">Farmer Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
              <User className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Farmer Name</span>
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
              <Package className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-800">{stats.totalListings}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Total Listings</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">{stats.activeListings}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Active Listings</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-800">{stats.totalOffers}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Total Offers</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-800">₹{stats.totalEarnings.toLocaleString()}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Total Earnings</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/farmer/create-listing')}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all flex items-center gap-2 hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Create New Listing
          </button>
        </div>

        {/* Listings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Listings</h2>
          
          {listings.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No listings yet</p>
              <button
                onClick={() => navigate('/farmer/create-listing')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Your First Listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div key={listing.id} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all hover:border-green-500">
                  <div className="relative">
                    <img
                      src={listing.imageUrl}
                      alt="Groundnut"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        listing.status === 'active' ? 'bg-green-600 text-white' :
                        listing.status === 'sold' ? 'bg-gray-600 text-white' :
                        'bg-yellow-600 text-white'
                      }`}>
                        {listing.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-green-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600">Quality</p>
                        <p className="font-semibold text-green-700">{listing.quality}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600">Moisture</p>
                        <p className="font-semibold text-blue-700">{listing.moisture}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600">Rate</p>
                        <p className="font-semibold text-purple-700">{listing.rate}</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600">Quantity</p>
                        <p className="font-semibold text-orange-700">{listing.quantity} tonnes</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Total Price</p>
                        <p className="text-lg font-bold text-gray-800">₹{listing.price.toLocaleString()}</p>
                      </div>
                      {listing.offers > 0 && (
                        <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                          <span className="text-xs font-semibold">{listing.offers} Offers</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => navigate(`/farmer/offers/${listing.id}`)}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      {listing.offers > 0 ? 'View Offers' : 'View Details'}
                    </button>

                    <p className="text-xs text-gray-500 mt-2 text-center">Created {listing.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;
