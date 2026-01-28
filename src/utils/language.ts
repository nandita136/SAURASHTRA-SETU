export type Language = 'en' | 'gu';

const translations = {
  en: {
    // Common
    welcome: 'Welcome',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
    back: 'Back',
    continue: 'Continue',
    close: 'Close',
    
    // Auth
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    loginAsAdmin: 'Login as Admin',
    
    // User Types
    farmer: 'Farmer',
    company: 'Company',
    buyer: 'Buyer',
    
    // App Name
    appName: 'Saurashtra Setu',
    tagline: 'Connecting Farmers & Buyers',
    
    // Farmer
    farmerDashboard: 'Farmer Dashboard',
    createListing: 'Create New Listing',
    myListings: 'My Listings',
    uploadPhoto: 'Upload Groundnut Photo',
    aiAnalysis: 'AI Quality Analysis',
    viewOffers: 'View Offers',
    
    // Company
    companyDashboard: 'Buyer Dashboard',
    browseListings: 'Browse Listings',
    makeOffer: 'Make an Offer',
    
    // Listing
    quality: 'Quality',
    grade: 'Grade',
    moisture: 'Moisture',
    quantity: 'Quantity',
    price: 'Price',
    available: 'Available',
    sold: 'Sold',
    
    // Admin
    adminPanel: 'Admin Panel',
    manageUsers: 'Manage Users',
    manageBids: 'Manage Bids',
    manageDeals: 'Manage Deals',
    
    // Messages
    otpSent: 'OTP sent successfully',
    otpVerified: 'OTP verified successfully',
    registrationSuccess: 'Registration successful',
    loginSuccess: 'Login successful',
    offerSubmitted: 'Offer submitted successfully',
    dealAccepted: 'Deal accepted successfully',
  },
  gu: {
    // Common
    welcome: 'સ્વાગત છે',
    login: 'લૉગિન',
    signup: 'સાઇન અપ',
    logout: 'લૉગઆઉટ',
    submit: 'સબમિટ',
    cancel: 'રદ કરો',
    save: 'સેવ કરો',
    delete: 'ડિલીટ કરો',
    edit: 'એડિટ કરો',
    confirm: 'પુષ્ટિ કરો',
    back: 'પાછળ',
    continue: 'આગળ વધો',
    close: 'બંધ કરો',
    
    // Auth
    email: 'ઇમેઇલ',
    password: 'પાસવર્ડ',
    confirmPassword: 'પાસવર્ડની પુષ્ટિ કરો',
    forgotPassword: 'પાસવર્ડ ભૂલી ગયા?',
    dontHaveAccount: 'એકાઉન્ટ નથી?',
    alreadyHaveAccount: 'પહેલેથી એકાઉન્ટ છે?',
    loginAsAdmin: 'એડમિન તરીકે લોગિન કરો',
    
    // User Types
    farmer: 'ખેડૂત',
    company: 'કંપની',
    buyer: 'ખરીદનાર',
    
    // App Name
    appName: 'સૌરાષ્ટ્ર સેતુ',
    tagline: 'ખેડૂતો અને ખરીદદારોને જોડવું',
    
    // Farmer
    farmerDashboard: 'ખેડૂત ડેશબોર્ડ',
    createListing: 'નવી લિસ્ટિંગ બનાવો',
    myListings: 'મારી લિસ્ટિંગ્સ',
    uploadPhoto: 'મગફળીનો ફોટો અપલોડ કરો',
    aiAnalysis: 'AI ગુણવત્તા વિશ્લેષણ',
    viewOffers: 'ઓફર્સ જુઓ',
    
    // Company
    companyDashboard: 'ખરીદનાર ડેશબોર્ડ',
    browseListings: 'લિસ્ટિંગ્સ બ્રાઉઝ કરો',
    makeOffer: 'ઓફર આપો',
    
    // Listing
    quality: 'ગુણવત્તા',
    grade: 'ગ્રેડ',
    moisture: 'ભેજ',
    quantity: 'જથ્થો',
    price: 'કિંમત',
    available: 'ઉપલબ્ધ',
    sold: 'વેચાઈ ગયું',
    
    // Admin
    adminPanel: 'એડમિન પેનલ',
    manageUsers: 'વપરાશકર્તાઓ સંચાલિત કરો',
    manageBids: 'બિડ્સ સંચાલિત કરો',
    manageDeals: 'સોદા સંચાલિત કરો',
    
    // Messages
    otpSent: 'OTP સફળતાપૂર્વક મોકલ્યો',
    otpVerified: 'OTP સફળતાપૂર્વક ચકાસાયો',
    registrationSuccess: 'નોંધણી સફળ',
    loginSuccess: 'લોગિન સફળ',
    offerSubmitted: 'ઓફર સફળતાપૂર્વક સબમિટ થયું',
    dealAccepted: 'સોદો સ્વીકારવામાં આવ્યો',
  },
};

let currentLanguage: Language = 'en';

export function setLanguage(lang: Language) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
}

export function getLanguage(): Language {
  const saved = localStorage.getItem('language');
  return (saved as Language) || 'en';
}

export function t(key: string): string {
  const keys = key.split('.');
  let value: any = translations[getLanguage()];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}

export function initLanguage() {
  const saved = localStorage.getItem('language');
  if (saved) {
    currentLanguage = saved as Language;
  }
}
