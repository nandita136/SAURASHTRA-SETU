Saurashtra Setu

Saurashtra Setu is a digital agri-trade platform designed to connect farmers and buyers/companies across the Saurashtra region of Gujarat. The platform ensures trust, transparency, and fair pricing using Aadhaar-based verification, OTP authentication, AI-powered crop quality analysis, and a secure bidding system.

📌 Problem Statement

Farmers in the Saurashtra region often face:

Lack of direct access to buyers

Unfair pricing due to middlemen

No transparent quality assessment of crops

Delays in deal confirmation and payments

Buyers face:

Difficulty verifying farmer authenticity

No standardized crop quality metrics

Limited regional filtering

💡 Solution: Saurashtra Setu

Saurashtra Setu acts as a digital bridge (Setu) between farmers and buyers by providing:

Verified onboarding

AI-based crop analysis from images

Transparent bidding and deal management

Region-restricted (Saurashtra only) operations

✨ Key Features
👨‍🌾 Farmer Features

Aadhaar-verified signup with OTP (Phone + Email)

Region selection restricted to Saurashtra pincodes

Upload crop images (e.g., groundnut)

AI-generated quality certificate:

Moisture percentage

Quality grade

Defects

Recommended price per kg

Create crop listings (quantity & expected price)

Accept or reject buyer offers

Close deal after successful transaction

🏭 Buyer / Company Features

Company registration with verification documents

OTP-based phone & email verification

Browse verified farmer listings

Make partial or full quantity offers (e.g., buy 7–9 tons out of 10)

View AI quality certificate before bidding

Contact details shared only after deal confirmation

Cancel deal within a limited time window (2–3 days)

🧠 AI-Powered Crop Analysis

Uses OpenAI Vision API

Analyzes uploaded crop images

Generates structured quality data:

Quality

Grade

Moisture level

Color & size

Defects

Recommended market price

🛡️ Admin Panel

Secure admin login (email + password + OTP)

View all users, listings, bids, and deals

Add / remove users

Cancel or delete bids and deals

Monitor reports and flagged profiles

Full database visibility via Supabase

🌐 Additional Features

Gujarati language toggle (UI localization)

Forgot password via email or phone OTP

Report any profile with reason

All forms are mandatory & validated

Easy-to-use, farmer-friendly UI

🏗️ Tech Stack
Frontend

React + Vite

TypeScript

Tailwind CSS

React Router

Backend

Node.js

Express.js

Multer (image uploads)

OpenAI API (image analysis)

Database & Auth

Supabase (PostgreSQL)

Supabase Auth

OTP verification (Email & Phone)