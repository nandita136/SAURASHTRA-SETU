import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, DollarSign, Phone, Mail, MapPin, Check, X, Package } from 'lucide-react';

interface Offer {
  id: string;
  companyId: string;
  companyName: string;
  companyLocation: string;
  quantity: number;
  pricePerKg: number;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
  contactPhone?: string;
  contactEmail?: string;
}

const ViewOffers: React.FC = () => {
  const navigate = useNavigate();
  const { listingId } = useParams();

  const [listing] = useState({
    id: listingId,
    imageUrl: 'https://images.unsplash.com/photo-1599909533555-2e56dc0be6b7?w=400',
    quality: 'Premium',
    grade: 'Grade A',
    moisture: '8.5%',
    quantity: 10,
    availableQuantity: 10,
    pricePerKg: 65,
    farmerPhone: '+91 98765 43210',
    farmerEmail: 'farmer@example.com'
  });

  const [offers, setOffers] = useState<Offer[]>([
    {
      id: 'O001',
      companyId: 'C001',
      companyName: 'Gujarat Groundnut Traders',
      companyLocation: 'Rajkot, Gujarat',
      quantity: 7,
      pricePerKg: 65,
      totalAmount: 455000,
      status: 'pending',
      submittedAt: '2 hours ago'
    },
    {
      id: 'O002',
      companyId: 'C002',
      companyName: 'Saurashtra Agro Industries',
      companyLocation: 'Junagadh, Gujarat',
      quantity: 10,
      pricePerKg: 67,
      totalAmount: 670000,
      status: 'pending',
      submittedAt: '5 hours ago'
    },
    {
      id: 'O003',
      companyId: 'C003',
      companyName: 'Premium Nuts Export',
      companyLocation: 'Amreli, Gujarat',
      quantity: 5,
      pricePerKg: 64,
      totalAmount: 320000,
      status: 'pending',
      submittedAt: '1 day ago'
    }
  ]);

  const [acceptedOffer, setAcceptedOffer] = useState<Offer | null>(null);
  const [showDealConfirmation, setShowDealConfirmation] = useState(false);

  const handleAcceptOffer = (offer: Offer) => {
    // Update offer status
    const updatedOffers = offers.map(o =>
      o.id === offer.id
        ? { ...o, status: 'accepted' as const, contactPhone: '+91 98765 12345', contactEmail: 'company@example.com' }
        : o.status === 'pending'
        ? { ...o, status: 'rejected' as const }
        : o
    );
    
    setOffers(updatedOffers);
    setAcceptedOffer({
      ...offer,
      contactPhone: '+91 98765 12345',
      contactEmail: 'company@example.com'
    });
    setShowDealConfirmation(true);

    // TODO: Submit to backend
    console.log('Accepting offer:', offer);
  };

  const handleRejectOffer = (offerId: string) => {
    const updatedOffers = offers.map(o =>
      o.id === offerId ? { ...o, status: 'rejected' as const } : o
    );
    setOffers(updatedOffers);

    // TODO: Submit to backend
    console.log('Rejecting offer:', offerId);
  };

  const handleCloseListing = () => {
    // TODO: Submit to backend to mark listing as closed
    console.log('Closing listing:', listingId);
    alert('Listing closed successfully!');
    navigate('/farmer/dashboard');
  };

  const pendingOffers = offers.filter(o => o.status === 'pending');
  const acceptedOffers = offers.filter(o => o.status === 'accepted');

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
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-2">
            Offers for Your Listing
          </h1>
          <p className="text-gray-600">
            Review and accept offers from buyers
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Listing Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="font-bold text-gray-800 mb-4">Your Listing</h3>
              
              <img
                src={listing.imageUrl}
                alt="Groundnut"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Quality</span>
                  <span className="font-semibold text-green-700">{listing.quality}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Grade</span>
                  <span className="font-semibold text-green-700">{listing.grade}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Moisture</span>
                  <span className="font-semibold text-blue-700">{listing.moisture}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Quantity</span>
                  <span className="font-semibold text-gray-800">{listing.quantity} tonnes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Available</span>
                  <span className="font-semibold text-purple-700">{listing.availableQuantity} tonnes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Your Price</span>
                  <span className="font-semibold text-emerald-700">₹{listing.pricePerKg}/kg</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 mb-3">
                  <p className="text-xs text-blue-800 mb-1">Total Offers</p>
                  <p className="text-2xl font-bold text-blue-900">{offers.length}</p>
                </div>
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-800 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-green-900">{pendingOffers.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Offers List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">All Offers</h2>

              {offers.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No offers yet</p>
                  <p className="text-sm text-gray-400 mt-2">Companies will see your listing and make offers soon</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className={`border-2 rounded-xl p-6 transition-all ${
                        offer.status === 'accepted'
                          ? 'border-green-500 bg-green-50'
                          : offer.status === 'rejected'
                          ? 'border-gray-300 bg-gray-50 opacity-60'
                          : 'border-gray-200 hover:border-emerald-500 hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-full flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">{offer.companyName}</h3>
                            <p className="text-sm text-gray-600">{offer.companyLocation}</p>
                            <p className="text-xs text-gray-500 mt-1">Submitted {offer.submittedAt}</p>
                          </div>
                        </div>
                        
                        {offer.status === 'accepted' && (
                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <Check className="w-4 h-4" />
                            Accepted
                          </span>
                        )}
                        {offer.status === 'rejected' && (
                          <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <X className="w-4 h-4" />
                            Rejected
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Quantity</p>
                          <p className="font-bold text-purple-700">{offer.quantity} tonnes</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Price/kg</p>
                          <p className="font-bold text-emerald-700">₹{offer.pricePerKg}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                          <p className="font-bold text-gray-800">₹{offer.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Contact Details (shown when accepted) */}
                      {offer.status === 'accepted' && offer.contactPhone && (
                        <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 mb-4">
                          <p className="text-sm font-semibold text-green-800 mb-2">Buyer Contact Details:</p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-green-700">
                              <Phone className="w-4 h-4" />
                              <span className="text-sm">{offer.contactPhone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-700">
                              <Mail className="w-4 h-4" />
                              <span className="text-sm">{offer.contactEmail}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {offer.status === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleRejectOffer(offer.id)}
                            className="flex-1 py-2 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Reject
                          </button>
                          <button
                            onClick={() => handleAcceptOffer(offer)}
                            className="flex-1 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg font-medium flex items-center justify-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Accept Offer
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Deal Confirmation Modal */}
      {showDealConfirmation && acceptedOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-block relative mb-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Deal Confirmed!
              </h3>
              <p className="text-gray-600">
                You have accepted the offer from {acceptedOffer.companyName}
              </p>
            </div>

            {/* Deal Summary */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border-2 border-green-200">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Quantity</p>
                  <p className="font-bold text-gray-800">{acceptedOffer.quantity} tonnes</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Price/kg</p>
                  <p className="font-bold text-emerald-700">₹{acceptedOffer.pricePerKg}</p>
                </div>
              </div>
              <div className="pt-4 border-t-2 border-green-200">
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-green-700">₹{acceptedOffer.totalAmount.toLocaleString()}</p>
              </div>
            </div>

            {/* Contact Exchange */}
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-800 mb-2">Buyer Contact:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{acceptedOffer.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{acceptedOffer.contactEmail}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-800 mb-2">Your Contact (Shared with Buyer):</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-green-700">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{listing.farmerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{listing.farmerEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-yellow-800 mb-2">Next Steps:</p>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Contact the buyer to arrange delivery details</li>
                <li>• Coordinate pickup location and timing</li>
                <li>• Ensure quality matches the AI certificate</li>
                <li>• Complete payment as per agreement</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDealConfirmation(false)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                View Other Offers
              </button>
              <button
                onClick={handleCloseListing}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
              >
                Close Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOffers;
