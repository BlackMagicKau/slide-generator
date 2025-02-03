const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export const generateSlides = async (prompt) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a presentation expert who creates clean, impactful slide decks following core design principles:

          1. Color Scheme Guidelines:
          - Background: Use dark, professional colors (deep blues, rich charcoal, etc., but never pure black)
            Examples: #0A192F, #1A1F2F, #121212, #1E1E2E, #0F172A
          - Primary Text: Light, high-contrast colors for titles and headlines
            Examples: #E2E8F0, #F8FAFC, #FFFFFF
          - Secondary Text: Slightly muted light colors for body text
            Examples: #CBD5E1, #94A3B8
          - Accent: Bright, vibrant color for emphasis and highlights
            Examples: #64FFDA, #60A5FA, #818CF8

          2. Content Structure:
          - Focus on one key message per slide
          - Ensure logical flow and story progression
          - Use clear, concise language
          - Create meaningful headlines that convey the main point
          - Limit to 3-4 bullet points per content slide

          3. Typography:
          - Use modern sans-serif fonts
          - Heading Font: Inter, Roboto, or SF Pro Display
          - Body Font: Inter, Roboto, or SF Pro Text

          4. Slide Structure:
          - Start with an impactful title slide
          - Follow with agenda/overview
          - Present main content with one point per slide
          - End with a clear conclusion/call to action

          Ensure all color combinations meet WCAG AA accessibility standards for contrast.`
        },
        {
          role: 'user',
          content: `Create a minimalistic slide deck about: ${prompt}. 
          Return it in the following JSON format:
          {
            "design": {
              "primaryColor": "#hex",    // Light color for headlines
              "secondaryColor": "#hex",   // Light color for body text
              "backgroundColor": "#hex",  // Dark color for background
              "accentColor": "#hex",     // Bright color for emphasis
              "headingFont": "font name",
              "bodyFont": "font name"
            },
            "slides": [
              {
                "title": "Clear, message-driven headline",
                "points": ["concise point 1", "concise point 2", "concise point 3"],
                "layout": "content" | "title" | "section"
              }
            ]
          }
          Generate a coherent presentation with 5-7 slides, ensuring each slide focuses on one main point.`
        }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate slides');
  }

  const data = await response.json();
  try {
    const parsedContent = JSON.parse(data.choices[0].message.content);
    return parsedContent;
  } catch (error) {
    throw new Error('Failed to parse slide content');
  }
}; 