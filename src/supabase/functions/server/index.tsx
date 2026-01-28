import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Helper function to verify auth token
async function verifyAuth(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  
  // Check if it's an admin token
  if (token && token.startsWith('admin-token-')) {
    return {
      id: 'admin',
      email: 'sydneykevadiya7@gmail.com',
      user_metadata: { user_type: 'admin' }
    };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// Helper function to verify admin
async function verifyAdmin(authHeader: string | null) {
  const user = await verifyAuth(authHeader);
  if (!user) return false;
  
  // Check if user is admin
  if (user.id === 'admin' || user.user_metadata?.user_type === 'admin') {
    return true;
  }
  
  return false;
}

// ==================== AUTHENTICATION ROUTES ====================

// Login
app.post('/make-server-dc1b1882/auth/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, userType } = body;

    console.log('Login attempt:', { email, userType });

    // Special case for admin
    if (userType === 'admin') {
      if (email === 'sydneykevadiya7@gmail.com' && password === '12345678') {
        // Generate a token for admin
        const adminToken = 'admin-token-' + Date.now();
        return c.json({
          success: true,
          token: adminToken,
          user: {
            id: 'admin',
            email,
            userType: 'admin',
            name: 'Admin'
          }
        });
      } else {
        return c.json({ error: 'Invalid admin credentials' }, 401);
      }
    }

    // Regular user login via Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.log('Login error:', error);
      return c.json({ error: error.message }, 401);
    }

    // Get user profile from KV - try both types if userType not specified correctly
    let userProfile = await kv.get(`${userType}:${data.user.id}`);
    
    // If not found with specified type, try to find in either farmer or company
    if (!userProfile) {
      const farmerProfile = await kv.get(`farmer:${data.user.id}`);
      const companyProfile = await kv.get(`company:${data.user.id}`);
      userProfile = farmerProfile || companyProfile;
    }
    
    if (!userProfile) {
      return c.json({ error: 'User profile not found. Please complete registration.' }, 404);
    }

    return c.json({
      success: true,
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        userType: userProfile.userType,
        name: userProfile.name || userProfile.companyName
      }
    });
  } catch (error) {
    console.log('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Farmer Signup
app.post('/make-server-dc1b1882/auth/farmer/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, aadhar, phone, pincode, region, address } = body;

    console.log('Farmer signup attempt:', { email, name });

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since email server not configured
      user_metadata: {
        user_type: 'farmer',
        name,
        phone
      }
    });

    if (authError) {
      console.log('Farmer signup auth error:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Create user profile in KV store
    const userProfile = {
      id: authData.user.id,
      email: authData.user.email,
      name,
      phone,
      aadhar,
      pincode,
      userType: 'farmer',
      phoneVerified: false,
      emailVerified: false,
      createdAt: new Date().toISOString()
    };

    await kv.set(`farmer:${authData.user.id}`, userProfile);
    
    // Add to farmers list for admin
    const farmersListKey = 'list:farmers';
    const farmersList = await kv.get(farmersListKey) || [];
    farmersList.push({
      id: authData.user.id,
      email: authData.user.email,
      name,
      phone,
      aadhar,
      pincode,
      createdAt: userProfile.createdAt
    });
    await kv.set(farmersListKey, farmersList);

    return c.json({
      success: true,
      userId: authData.user.id,
      message: 'Farmer registered successfully'
    });
  } catch (error) {
    console.log('Error in farmer signup:', error);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// Company Signup
app.post('/make-server-dc1b1882/auth/company/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, companyName, registrationNumber, gstNumber, contactPerson, phone, address } = body;

    console.log('Company signup attempt:', { email, companyName });

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        user_type: 'company',
        company_name: companyName,
        contact_person: contactPerson,
        phone
      }
    });

    if (authError) {
      console.log('Company signup auth error:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Store company profile in KV
    const companyProfile = {
      id: authData.user.id,
      companyName,
      registrationNumber,
      gstNumber,
      contactPerson,
      email,
      phone,
      address,
      userType: 'company',
      verified: false, // Requires admin verification
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`company:${authData.user.id}`, companyProfile);
    
    // Add to companies list for admin
    const companiesListKey = 'list:companies';
    const companiesList = await kv.get(companiesListKey) || [];
    companiesList.push({
      id: authData.user.id,
      email: authData.user.email,
      companyName,
      registrationNumber,
      gstNumber,
      contactPerson,
      phone,
      address,
      createdAt: companyProfile.createdAt
    });
    await kv.set(companiesListKey, companiesList);

    return c.json({ success: true, userId: authData.user.id });
  } catch (error) {
    console.log('Error in company signup:', error);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// Send OTP for verification during signup
app.post('/make-server-dc1b1882/auth/send-verification-otp', async (c) => {
  try {
    const body = await c.req.json();
    const { email, phone, userId } = body;

    console.log('Sending verification OTP to:', { email, phone, userId });

    // Store OTP in KV (in production, send actual SMS/Email)
    const phoneOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();

    await kv.set(`otp:phone:${userId}`, { otp: phoneOtp, timestamp: Date.now() });
    await kv.set(`otp:email:${userId}`, { otp: emailOtp, timestamp: Date.now() });

    console.log('Generated OTPs for user', userId, '- Phone:', phoneOtp, 'Email:', emailOtp);

    return c.json({ 
      success: true, 
      message: 'OTP sent successfully',
      // For testing/demo purposes, return OTPs in response
      debug: { phoneOtp, emailOtp }
    });
  } catch (error) {
    console.log('Error sending OTP:', error);
    return c.json({ error: 'Failed to send OTP' }, 500);
  }
});

// Verify OTP
app.post('/make-server-dc1b1882/auth/verify-otp', async (c) => {
  try {
    const body = await c.req.json();
    const { userId, type, otp } = body;

    console.log('Verifying OTP:', { userId, type, otp, otpType: typeof otp });

    const storedData = await kv.get(`otp:${type}:${userId}`);
    console.log('Stored OTP data:', storedData);

    if (!storedData) {
      console.log('No OTP found for key:', `otp:${type}:${userId}`);
      return c.json({ error: 'OTP not found or expired' }, 400);
    }

    // Handle both old format (string) and new format (object)
    let storedOtp;
    let otpTimestamp;
    
    if (typeof storedData === 'string') {
      storedOtp = storedData;
      otpTimestamp = Date.now(); // Assume recent if no timestamp
    } else if (storedData && storedData.otp) {
      storedOtp = storedData.otp;
      otpTimestamp = storedData.timestamp || Date.now();
    } else {
      console.log('Invalid OTP data format:', storedData);
      return c.json({ error: 'Invalid OTP data' }, 400);
    }

    // Convert both to strings and trim whitespace
    const inputOtp = String(otp).trim();
    const expectedOtp = String(storedOtp).trim();

    console.log('Comparing OTPs:', { inputOtp, expectedOtp, match: inputOtp === expectedOtp });

    if (inputOtp !== expectedOtp) {
      return c.json({ error: 'Invalid OTP' }, 400);
    }

    // Check if OTP is expired (10 minutes)
    const otpAge = Date.now() - otpTimestamp;
    if (otpAge > 600000) {
      await kv.del(`otp:${type}:${userId}`);
      return c.json({ error: 'OTP expired' }, 400);
    }

    // Delete used OTP
    await kv.del(`otp:${type}:${userId}`);

    console.log('OTP verified successfully for user:', userId);
    return c.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.log('Error verifying OTP:', error);
    return c.json({ error: 'Verification failed' }, 500);
  }
});

// Forgot Password - Send OTP
app.post('/make-server-dc1b1882/auth/forgot-password/send-otp', async (c) => {
  try {
    const body = await c.req.json();
    const { identifier, method } = body;

    console.log('Forgot password OTP request:', { identifier, method });

    // Generate and store OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await kv.set(`reset-otp:${identifier}`, otp);

    console.log('Generated reset OTP:', otp);

    return c.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.log('Error sending reset OTP:', error);
    return c.json({ error: 'Failed to send OTP' }, 500);
  }
});

// Forgot Password - Verify OTP
app.post('/make-server-dc1b1882/auth/forgot-password/verify-otp', async (c) => {
  try {
    const body = await c.req.json();
    const { identifier, otp } = body;

    const storedOtp = await kv.get(`reset-otp:${identifier}`);

    if (!storedOtp || storedOtp !== otp) {
      return c.json({ error: 'Invalid OTP' }, 400);
    }

    return c.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.log('Error verifying reset OTP:', error);
    return c.json({ error: 'Verification failed' }, 500);
  }
});

// Forgot Password - Reset
app.post('/make-server-dc1b1882/auth/forgot-password/reset', async (c) => {
  try {
    const body = await c.req.json();
    const { identifier, otp, newPassword } = body;

    const storedOtp = await kv.get(`reset-otp:${identifier}`);

    if (!storedOtp || storedOtp !== otp) {
      return c.json({ error: 'Invalid OTP' }, 400);
    }

    // Find user by email or phone
    const farmers = await kv.getByPrefix('farmer:');
    const companies = await kv.getByPrefix('company:');
    const allUsers = [...farmers, ...companies];

    const user = allUsers.find((u: any) => 
      u.value.email === identifier || u.value.phone === identifier
    );

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Update password in Supabase
    const { error } = await supabase.auth.admin.updateUserById(
      user.value.id,
      { password: newPassword }
    );

    if (error) {
      console.log('Error updating password:', error);
      return c.json({ error: 'Failed to update password' }, 500);
    }

    // Delete used OTP
    await kv.del(`reset-otp:${identifier}`);

    return c.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.log('Error resetting password:', error);
    return c.json({ error: 'Reset failed' }, 500);
  }
});

// Get User Profile
app.get('/make-server-dc1b1882/auth/profile', async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userType = user.user_metadata?.user_type;
    const profile = await kv.get(`${userType}:${user.id}`);

    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.log('Error fetching profile:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// ==================== LISTING ROUTES ====================

// Create Listing
app.post('/make-server-dc1b1882/listings', async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user || user.user_metadata?.user_type !== 'farmer') {
      return c.json({ error: 'Unauthorized - Farmers only' }, 401);
    }

    const body = await c.req.json();
    const { aiAnalysis, quantity, sellingPrice, imageUrl } = body;

    const listingId = crypto.randomUUID();
    const farmer = await kv.get(`farmer:${user.id}`);
    
    const listing = {
      id: listingId,
      farmerId: user.id,
      farmerName: farmer.name,
      farmerLocation: `${farmer.address}, ${farmer.region}`,
      imageUrl,
      quality: aiAnalysis.quality,
      grade: aiAnalysis.grade,
      moisture: aiAnalysis.moisture,
      color: aiAnalysis.color,
      size: aiAnalysis.size,
      defects: aiAnalysis.defects,
      confidence: aiAnalysis.confidence,
      quantity: parseFloat(quantity),
      availableQuantity: parseFloat(quantity),
      pricePerKg: parseFloat(sellingPrice),
      totalValue: parseFloat(quantity) * parseFloat(sellingPrice) * 1000,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    await kv.set(`listing:${listingId}`, listing);
    
    // Add to farmer's listings
    const farmerListings = await kv.get(`farmer_listings:${user.id}`) || [];
    farmerListings.push(listingId);
    await kv.set(`farmer_listings:${user.id}`, farmerListings);

    return c.json({ success: true, listing });
  } catch (error) {
    console.log('Error creating listing:', error);
    return c.json({ error: 'Failed to create listing' }, 500);
  }
});

// Get All Active Listings (for companies)
app.get('/make-server-dc1b1882/listings', async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get all listings from KV store
    const listingKeys = await kv.getByPrefix('listing:');
    const listings = listingKeys
      .map(item => item.value)
      .filter((listing: any) => listing.status === 'active')
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ listings });
  } catch (error) {
    console.log('Error fetching listings:', error);
    return c.json({ error: 'Failed to fetch listings' }, 500);
  }
});

// Get Farmer's Listings
app.get('/make-server-dc1b1882/listings/farmer', async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user || user.user_metadata?.user_type !== 'farmer') {
      return c.json({ error: 'Unauthorized - Farmers only' }, 401);
    }

    const listingIds = await kv.get(`farmer_listings:${user.id}`) || [];
    const listings = await Promise.all(
      listingIds.map((id: string) => kv.get(`listing:${id}`))
    );

    return c.json({ listings: listings.filter(Boolean) });
  } catch (error) {
    console.log('Error fetching farmer listings:', error);
    return c.json({ error: 'Failed to fetch listings' }, 500);
  }
});

// Update Listing Status
app.put('/make-server-dc1b1882/listings/:id/status', async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user || user.user_metadata?.user_type !== 'farmer') {
      return c.json({ error: 'Unauthorized - Farmers only' }, 401);
    }

    const listingId = c.req.param('id');
    const { status } = await c.req.json();

    const listing = await kv.get(`listing:${listingId}`);
    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }

    if (listing.farmerId !== user.id) {
      return c.json({ error: 'Not your listing' }, 403);
    }

    listing.status = status;
    await kv.set(`listing:${listingId}`, listing);

    return c.json({ success: true, listing });
  } catch (error) {
    console.log('Error updating listing status:', error);
    return c.json({ error: 'Failed to update listing' }, 500);
  }
});

// ==================== OFFER ROUTES ====================

// Create Offer
app.post('/make-server-dc1b1882/offers', async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user || user.user_metadata?.user_type !== 'company') {
      return c.json({ error: 'Unauthorized - Companies only' }, 401);
    }

    const body = await c.req.json();
    const { listingId, quantity, pricePerKg } = body;

    const listing = await kv.get(`listing:${listingId}`);
    if (!listing || listing.status !== 'active') {
      return c.json({ error: 'Listing not available' }, 404);
    }

    if (parseFloat(quantity) > listing.availableQuantity) {
      return c.json({ error: 'Quantity exceeds available amount' }, 400);
    }

    const offerId = crypto.randomUUID();
    const company = await kv.get(`company:${user.id}`);
    
    const offer = {
      id: offerId,
      listingId,
      companyId: user.id,
      companyName: company.companyName,
      companyLocation: company.address,
      farmerId: listing.farmerId,
      farmerName: listing.farmerName,
      quantity: parseFloat(quantity),
      pricePerKg: parseFloat(pricePerKg),
      totalAmount: parseFloat(quantity) * parseFloat(pricePerKg) * 1000,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await kv.set(`offer:${offerId}`, offer);

    // Add to listing's offers
    const listingOffers = await kv.get(`listing_offers:${listingId}`) || [];
    listingOffers.push(offerId);
    await kv.set(`listing_offers:${listingId}`, listingOffers);

    return c.json({ success: true, offer });
  } catch (error) {
    console.log('Error creating offer:', error);
    return c.json({ error: 'Failed to create offer' }, 500);
  }
});

// Get Offers for a Listing
app.get('/make-server-dc1b1882/listings/:id/offers', async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const listingId = c.req.param('id');
    const listing = await kv.get(`listing:${listingId}`);
    
    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }

    // Only farmer who owns the listing can view offers
    if (listing.farmerId !== user.id) {
      return c.json({ error: 'Not authorized to view these offers' }, 403);
    }

    const offerIds = await kv.get(`listing_offers:${listingId}`) || [];
    const offers = await Promise.all(
      offerIds.map((id: string) => kv.get(`offer:${id}`))
    );

    return c.json({ offers: offers.filter(Boolean) });
  } catch (error) {
    console.log('Error fetching offers:', error);
    return c.json({ error: 'Failed to fetch offers' }, 500);
  }
});

// Accept/Reject Offer
app.put('/make-server-dc1b1882/offers/:id', async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user || user.user_metadata?.user_type !== 'farmer') {
      return c.json({ error: 'Unauthorized - Farmers only' }, 401);
    }

    const offerId = c.req.param('id');
    const { status } = await c.req.json(); // 'accepted' or 'rejected'

    const offer = await kv.get(`offer:${offerId}`);
    if (!offer) {
      return c.json({ error: 'Offer not found' }, 404);
    }

    if (offer.farmerId !== user.id) {
      return c.json({ error: 'Not your offer to accept/reject' }, 403);
    }

    offer.status = status;
    offer.statusChangedAt = new Date().toISOString();
    await kv.set(`offer:${offerId}`, offer);

    // If accepted, update listing available quantity and reject other offers
    if (status === 'accepted') {
      const listing = await kv.get(`listing:${offer.listingId}`);
      listing.availableQuantity -= offer.quantity;
      
      if (listing.availableQuantity <= 0) {
        listing.status = 'sold';
      }
      
      await kv.set(`listing:${offer.listingId}`, listing);

      // Reject all other pending offers for this listing
      const offerIds = await kv.get(`listing_offers:${offer.listingId}`) || [];
      for (const id of offerIds) {
        if (id !== offerId) {
          const otherOffer = await kv.get(`offer:${id}`);
          if (otherOffer && otherOffer.status === 'pending') {
            otherOffer.status = 'rejected';
            await kv.set(`offer:${id}`, otherOffer);
          }
        }
      }

      // Share contact information
      const farmer = await kv.get(`farmer:${user.id}`);
      const company = await kv.get(`company:${offer.companyId}`);
      
      offer.farmerContact = {
        name: farmer.name,
        phone: farmer.phone,
        email: farmer.email,
        location: `${farmer.address}, ${farmer.region}`
      };
      offer.companyContact = {
        name: company.contactPerson,
        phone: company.phone,
        email: company.email,
        location: company.address
      };
      
      await kv.set(`offer:${offerId}`, offer);
    }

    return c.json({ success: true, offer });
  } catch (error) {
    console.log('Error updating offer:', error);
    return c.json({ error: 'Failed to update offer' }, 500);
  }
});

// ==================== REPORT ROUTES ====================

// Create Report
app.post('/make-server-dc1b1882/reports', async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { reportedUserId, reportedUserName, reportedUserType, reason, description } = body;

    const reportId = crypto.randomUUID();
    const report = {
      id: reportId,
      reporterId: user.id,
      reportedUserId,
      reportedUserName,
      reportedUserType,
      reason,
      description,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await kv.set(`report:${reportId}`, report);

    return c.json({ success: true, report });
  } catch (error) {
    console.log('Error creating report:', error);
    return c.json({ error: 'Failed to create report' }, 500);
  }
});

// ==================== ADMIN ROUTES ====================

// Get all users
app.get('/make-server-dc1b1882/admin/users', async (c) => {
  try {
    // Verify admin access
    const isAdmin = await verifyAdmin(c.req.header('Authorization'));
    if (!isAdmin) {
      console.log('Unauthorized admin access attempt');
      return c.json({ error: 'Unauthorized - Admin access required' }, 401);
    }
    
    console.log('Admin: Fetching all users...');
    
    const farmers = await kv.getByPrefix('farmer:');
    const companies = await kv.getByPrefix('company:');
    
    console.log('Farmers found:', farmers?.length || 0);
    console.log('Companies found:', companies?.length || 0);
    
    // Handle both array and object responses from getByPrefix
    const farmerUsers = Array.isArray(farmers) ? farmers.map(item => item.value || item) : [];
    const companyUsers = Array.isArray(companies) ? companies.map(item => item.value || item) : [];
    
    const users = [...farmerUsers, ...companyUsers];
    
    console.log('Total users returned:', users.length);

    return c.json({ users });
  } catch (error) {
    console.log('Error fetching users:', error);
    return c.json({ error: 'Failed to fetch users', details: String(error) }, 500);
  }
});

// Delete user
app.delete('/make-server-dc1b1882/admin/users/:id', async (c) => {
  try {
    // Verify admin access
    const isAdmin = await verifyAdmin(c.req.header('Authorization'));
    if (!isAdmin) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 401);
    }
    
    const userId = c.req.param('id');
    
    // Delete from Supabase auth
    await supabase.auth.admin.deleteUser(userId);
    
    // Delete from KV
    await kv.del(`farmer:${userId}`);
    await kv.del(`company:${userId}`);

    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting user:', error);
    return c.json({ error: 'Failed to delete user' }, 500);
  }
});

// Get all listings
app.get('/make-server-dc1b1882/admin/listings', async (c) => {
  try {
    // Verify admin access
    const isAdmin = await verifyAdmin(c.req.header('Authorization'));
    if (!isAdmin) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 401);
    }
    
    const listingKeys = await kv.getByPrefix('listing:');
    const listings = listingKeys.map(item => item.value);

    return c.json({ listings });
  } catch (error) {
    console.log('Error fetching listings:', error);
    return c.json({ error: 'Failed to fetch listings' }, 500);
  }
});

// Delete listing
app.delete('/make-server-dc1b1882/admin/listings/:id', async (c) => {
  try {
    // Verify admin access
    const isAdmin = await verifyAdmin(c.req.header('Authorization'));
    if (!isAdmin) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 401);
    }
    
    const listingId = c.req.param('id');
    await kv.del(`listing:${listingId}`);

    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting listing:', error);
    return c.json({ error: 'Failed to delete listing' }, 500);
  }
});

// Get all offers
app.get('/make-server-dc1b1882/admin/offers', async (c) => {
  try {
    // Verify admin access
    const isAdmin = await verifyAdmin(c.req.header('Authorization'));
    if (!isAdmin) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 401);
    }
    
    const offerKeys = await kv.getByPrefix('offer:');
    const offers = offerKeys.map(item => item.value);

    return c.json({ offers });
  } catch (error) {
    console.log('Error fetching offers:', error);
    return c.json({ error: 'Failed to fetch offers' }, 500);
  }
});

// Cancel deal
app.put('/make-server-dc1b1882/admin/offers/:id/cancel', async (c) => {
  try {
    // Verify admin access
    const isAdmin = await verifyAdmin(c.req.header('Authorization'));
    if (!isAdmin) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 401);
    }
    
    const offerId = c.req.param('id');
    const offer = await kv.get(`offer:${offerId}`);
    
    if (!offer) {
      return c.json({ error: 'Offer not found' }, 404);
    }

    offer.status = 'cancelled';
    offer.cancelledAt = new Date().toISOString();
    await kv.set(`offer:${offerId}`, offer);

    // Restore listing quantity if it was accepted
    if (offer.status === 'accepted') {
      const listing = await kv.get(`listing:${offer.listingId}`);
      if (listing) {
        listing.availableQuantity += offer.quantity;
        listing.status = 'active';
        await kv.set(`listing:${offer.listingId}`, listing);
      }
    }

    return c.json({ success: true, offer });
  } catch (error) {
    console.log('Error cancelling deal:', error);
    return c.json({ error: 'Failed to cancel deal' }, 500);
  }
});

// Get all reports
app.get('/make-server-dc1b1882/admin/reports', async (c) => {
  try {
    // Verify admin access
    const isAdmin = await verifyAdmin(c.req.header('Authorization'));
    if (!isAdmin) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 401);
    }
    
    const reportKeys = await kv.getByPrefix('report:');
    const reports = reportKeys.map(item => item.value);

    return c.json({ reports });
  } catch (error) {
    console.log('Error fetching reports:', error);
    return c.json({ error: 'Failed to fetch reports' }, 500);
  }
});

// Resolve report
app.put('/make-server-dc1b1882/admin/reports/:id', async (c) => {
  try {
    // Verify admin access
    const isAdmin = await verifyAdmin(c.req.header('Authorization'));
    if (!isAdmin) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 401);
    }
    
    const reportId = c.req.param('id');
    const { action } = await c.req.json();

    const report = await kv.get(`report:${reportId}`);
    if (!report) {
      return c.json({ error: 'Report not found' }, 404);
    }

    report.status = action;
    report.resolvedAt = new Date().toISOString();
    await kv.set(`report:${reportId}`, report);

    return c.json({ success: true, report });
  } catch (error) {
    console.log('Error resolving report:', error);
    return c.json({ error: 'Failed to resolve report' }, 500);
  }
});

// ==================== FILE UPLOAD (Storage) ====================

// Initialize storage bucket on startup
const BUCKET_NAME = 'make-dc1b1882-groundnut-images';

async function initializeBucket() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 5242880 // 5MB
      });
      console.log('Storage bucket created:', BUCKET_NAME);
    }
  } catch (error) {
    console.log('Error initializing bucket:', error);
  }
}

// Upload Image
app.post('/make-server-dc1b1882/upload-image', async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`;
    
    const arrayBuffer = await file.arrayBuffer();
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, arrayBuffer, {
        contentType: file.type
      });

    if (error) {
      console.log('Error uploading file:', error);
      return c.json({ error: 'Upload failed' }, 500);
    }

    // Generate signed URL
    const { data: signedData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 31536000); // 1 year

    return c.json({ success: true, url: signedData?.signedUrl, path: fileName });
  } catch (error) {
    console.log('Error in upload:', error);
    return c.json({ error: 'Upload failed' }, 500);
  }
});

// Health check
app.get('/make-server-dc1b1882/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize bucket and start server
await initializeBucket();
Deno.serve(app.fetch);