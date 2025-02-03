# AI Slide Generator

A modern web application that generates PowerPoint presentations using AI. Simply enter a topic, and the application will create a well-structured slide deck with consistent design, formatting, and content flow. I didn't deploy this because I was just testing things out on my end for fun.

## Demo 

[![Demo](thumbnail.jpg)](https://github.com/BlackMagicKau/slide-generator/blame/main/Slide%20Generation%20Demo.m4v)

## Features

- 🎨 AI-powered slide generation with cohesive design schemes
- 🎯 One-point-per-slide approach for clear communication
- 📊 Clean, minimalistic slide layouts
- 🔒 User authentication with Firebase
- 💾 PowerPoint (.pptx) export functionality
- 🔄 Real-time slide preview

## Technologies Used

- React.js
- OpenAI API
- Firebase Authentication
- PptxGenJS

## Prerequisites

Before you begin, ensure you have:
- Node.js (v14 or higher)
- npm or yarn
- An OpenAI API key
- A Firebase project

## Setup

1. Clone the repository:

```console
git clone https://github.com/yourusername/slide-generator.git
cd slide-generatorgit
```

2. Install dependencies:

```console
npm install
```
3. Input your own .env values like Firebase credentials and OpenAI key based on the .env.sample file.

4. Start development server:

```console
npm run start
```
The application will be available at `http://localhost:3000`

## Usage

1. Register/Login with your email and password
2. Enter a presentation topic in the input field
3. Click "Generate Slides" to create your presentation
4. Preview the slides using the navigation controls
5. Download the presentation as a PowerPoint file

