# School Voting System

A web-based voting system for schools.

## Features
- Student registration
- Secure voting
- Real-time results
- Email notifications for vote confirmations

## Technologies
- HTML, CSS, JavaScript
- Node.js
- SQLite Database
- Brevo (Sendinblue) for email services

## Email Configuration

This system uses Brevo (formerly Sendinblue) for email notifications. 

### Setup Requirements:
- Brevo account with SMTP credentials
- Gmail App Password for email integration
- Configured email templates for vote notifications

### Environment Variables:
```env
BREVO_API_KEY=your_brevo_api_key
GMAIL_APP_PASSWORD=your_16_character_app_password
NOTIFICATION_EMAIL=your@email.com