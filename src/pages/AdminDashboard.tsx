import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Package, FileText, AlertTriangle, LogOut, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';
import { apiCall } from '../utils/api';
import { logout } from '../utils/auth';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'listings' | 'offers' | 'reports'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        try {
          const response = await apiCall('/admin/users');
          console.log('Admin users response:', response);
          setUsers(Array.isArray(response.users) ? response.users : []);
        } catch (error: any) {
          console.error('Error fetching users:', error);
          alert('Failed to load users: ' + (error.message || 'Unknown error'));
          setUsers([]);
        }
      } else if (activeTab === 'listings') {
        try {
          const response = await apiCall('/admin/listings');
          console.log('Admin listings response:', response);
          setListings(Array.isArray(response.listings) ? response.listings : []);
        } catch (error: any) {
          console.error('Error fetching listings:', error);
          alert('Failed to load listings: ' + (error.message || 'Unknown error'));
          setListings([]);
        }
      } else if (activeTab === 'offers') {
        try {
          const response = await apiCall('/admin/offers');
          console.log('Admin offers response:', response);
          setOffers(Array.isArray(response.offers) ? response.offers : []);
        } catch (error: any) {
          console.error('Error fetching offers:', error);
          alert('Failed to load offers: ' + (error.message || 'Unknown error'));
          setOffers([]);
        }
      } else if (activeTab === 'reports') {
        try {
          const response = await apiCall('/admin/reports');
          console.log('Admin reports response:', response);
          setReports(Array.isArray(response.reports) ? response.reports : []);
        } catch (error: any) {
          console.error('Error fetching reports:', error);
          alert('Failed to load reports: ' + (error.message || 'Unknown error'));
          setReports([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await apiCall(`/admin/users/${userId}`, {
        method: 'DELETE'
      });
      alert('User deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      await apiCall(`/admin/listings/${listingId}`, {
        method: 'DELETE'
      });
      alert('Listing deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing');
    }
  };

  const handleCancelDeal = async (offerId: string) => {
    if (!confirm('Are you sure you want to cancel this deal?')) return;

    try {
      await apiCall(`/admin/offers/${offerId}/cancel`, {
        method: 'PUT'
      });
      alert('Deal cancelled successfully');
      fetchData();
    } catch (error) {
      console.error('Error cancelling deal:', error);
      alert('Failed to cancel deal');
    }
  };

  const handleResolveReport = async (reportId: string, action: 'resolved' | 'dismissed') => {
    try {
      await apiCall(`/admin/reports/${reportId}`, {
        method: 'PUT',
        body: JSON.stringify({ action })
      });
      alert(`Report ${action} successfully`);
      fetchData();
    } catch (error) {
      console.error('Error resolving report:', error);
      alert('Failed to resolve report');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredData = () => {
    if (activeTab === 'users') {
      return users.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (activeTab === 'listings') {
      return listings.filter(l => 
        l.farmerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (activeTab === 'offers') {
      return offers.filter(o => 
        o.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.farmerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return reports.filter(r => 
        r.reportedUserName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };

  const stats = {
    totalUsers: users.length,
    totalListings: listings.length,
    totalOffers: offers.length,
    pendingReports: reports.filter(r => r.status === 'pending').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-sm text-gray-600">Saurashtra Setu</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">{stats.totalUsers}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Total Users</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-800">{stats.totalListings}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Total Listings</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-800">{stats.totalOffers}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Total Offers</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <span className="text-2xl font-bold text-gray-800">{stats.pendingReports}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Pending Reports</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex gap-2 mb-6 border-b-2 border-gray-200 pb-4">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'users'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'listings'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Package className="w-5 h-5 inline mr-2" />
              Listings
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'offers'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              Offers & Deals
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all relative ${
                activeTab === 'reports'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <AlertTriangle className="w-5 h-5 inline mr-2" />
              Reports
              {stats.pendingReports > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                  {stats.pendingReports}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
              />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4">Loading...</p>
            </div>
          ) : (
            <>
              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  {filteredData().map((user: any) => (
                    <div key={user.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-all bg-gray-50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              user.userType === 'farmer' ? 'bg-green-100' : 'bg-blue-100'
                            }`}>
                              <Users className={`w-6 h-6 ${
                                user.userType === 'farmer' ? 'text-green-600' : 'text-blue-600'
                              }`} />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">
                                {user.name || user.companyName}
                              </h3>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                user.userType === 'farmer' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {user.userType === 'farmer' ? '🌾 Farmer' : '🏢 Company'}
                              </span>
                            </div>
                          </div>

                          {/* Registration Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-gray-200">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">📧 Email</p>
                              <p className="text-sm font-semibold text-gray-800">{user.email}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">📱 Phone</p>
                              <p className="text-sm font-semibold text-gray-800">{user.phone}</p>
                            </div>
                            
                            {user.userType === 'farmer' ? (
                              <>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">🆔 Aadhar Number</p>
                                  <p className="text-sm font-semibold text-gray-800">{user.aadhar}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">📍 Pincode</p>
                                  <p className="text-sm font-semibold text-gray-800">{user.pincode}</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">👤 Contact Person</p>
                                  <p className="text-sm font-semibold text-gray-800">{user.contactPerson}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">📄 Registration No.</p>
                                  <p className="text-sm font-semibold text-gray-800">{user.registrationNumber}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">🏛️ GST Number</p>
                                  <p className="text-sm font-semibold text-gray-800">{user.gstNumber}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">🏠 Address</p>
                                  <p className="text-sm font-semibold text-gray-800">{user.address}</p>
                                </div>
                              </>
                            )}
                            
                            <div>
                              <p className="text-xs text-gray-500 mb-1">📅 Registered On</p>
                              <p className="text-sm font-semibold text-gray-800">
                                {user.createdAt ? new Date(user.createdAt).toLocaleString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">✅ User ID</p>
                              <p className="text-sm font-mono text-gray-600 truncate">{user.id}</p>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="ml-4 p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {filteredData().length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No users found</p>
                    </div>
                  )}
                </div>
              )}

              {/* Listings Table */}
              {activeTab === 'listings' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredData().map((listing: any) => (
                    <div key={listing.id} className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">{listing.farmerName}</p>
                          <p className="text-sm text-gray-600">{listing.quality} - {listing.grade}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          listing.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {listing.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-600">{listing.quantity} tonnes</span>
                        <span className="text-lg font-bold text-green-700">₹{listing.pricePerKg}/kg</span>
                      </div>
                      <button
                        onClick={() => handleDeleteListing(listing.id)}
                        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Listing
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Offers Table */}
              {activeTab === 'offers' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Company</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Farmer</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData().map((offer: any) => (
                        <tr key={offer.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{offer.companyName}</td>
                          <td className="px-4 py-3 text-sm">{offer.farmerName}</td>
                          <td className="px-4 py-3 text-sm">{offer.quantity} tonnes</td>
                          <td className="px-4 py-3 text-sm font-semibold">₹{offer.totalAmount?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              offer.status === 'accepted' ? 'bg-green-100 text-green-700' :
                              offer.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {offer.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {offer.status === 'accepted' && (
                              <button
                                onClick={() => handleCancelDeal(offer.id)}
                                className="text-red-600 hover:text-red-700 font-medium"
                              >
                                Cancel Deal
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Reports */}
              {activeTab === 'reports' && (
                <div className="space-y-4">
                  {filteredData().map((report: any) => (
                    <div key={report.id} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 mb-1">Report against {report.reportedUserName}</h3>
                            <p className="text-sm text-gray-600">{report.reportedUserType}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Reason: {report.reason}</p>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>

                      {report.status === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleResolveReport(report.id, 'dismissed')}
                            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-5 h-5" />
                            Dismiss
                          </button>
                          <button
                            onClick={() => handleResolveReport(report.id, 'resolved')}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Resolve
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;