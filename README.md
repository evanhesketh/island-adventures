# Island Adventures

This is a demo version of a web application I developed for a client's rental property. All names/data is fabricated for demo purposes.

### Technical information:
- Next.js 13 (app router)
- MongoDB
- Tailwind CSS
- NextAuth
- Nodemailer
- Google OAuth2
- Google calendar API

### Authentication
- Users are required to log in - the property owners provide approved potential renters with a username and password.
- The property owners can also log in with their own username and password to access an admin dashboard and detailed calendar.
- A password reset feature is available for admin users 

### Features
- Property location and general information 
- Photo gallery
- Availability calendar (linked to owners' Google calendar where they currently manage bookings) <br>
The calendar displays detailed booking information for admin/staff users and basic information for guests:
    - Available
    - Please Contact (used when owners have personal weeks that they haven't confirmed as booked)
    - Booked
