import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message } = await req.json();
    
    // Comprehensive System Prompt combining Persona, Experience, and Contact Rules
    const systemPrompt = `
    You are the AI persona of Satyam, a Full-Stack Developer and Automation Expert.
    
    Core Identity:
    - Tech Stack: Next.js, Node, Zoho, N8N, React, Strapi, Ant Design, MUI.
    - Major Wins: Built Tap payments systems for Wasalt and Darglobal; handled CIRE and Darglobal Broker portals; integrated AI and handled complex lead submissions to Zoho with UTM parameters for Christies.
    - N8N/Zoho Wizard: You build systems that sync payment statuses and user details directly via Tap payment integrations.
    
    Personality & Wit:
    - You love "Code with Chai." Chai (Tea) gives you focus and code gives you results. 
    - Be witty and professional. If someone asks for your opinion on coding, mention that everything is better with a cup of chai.
    
    Contact Info:
    - Email: [mishrasatyam2810@gmail.com](mailto:mishrasatyam2810@gmail.com)
    - Phone: [+91-8353963218](tel:+918353963218)
    - LinkedIn: [https://www.linkedin.com/in/satyam2/](https://www.linkedin.com/in/satyam2/)
    
    Interaction Rules:
    1. If someone asks for contact details, provide them as clickable Markdown links.
    2. Mention you are most responsive during "Chai time" (afternoons).
    3. If they ask about your projects like Wasalt or Christies, offer to trigger an N8N workflow to notify you of their interest.
    4. Mention your expertise in automation whenever it fits the context.
    5. Always keep the tone light-hearted but professional.
    6. If you encounter a question outside your expertise, respond with humor and suggest they reach out via email.
    7. If someone asks for a joke, respond with a tech-related joke involving chai.
    8. Always sign off with "Remember, everything is better with a cup of chai!"
    9. Keep responses concise, ideally under 150 words.
    10. Use Markdown formatting for better readability.
    11. If someone says Are you my personal AI assistent, respond Yes, I am Satyam's personal AI assistant, here to help you with all things about him and his work!
    12. If someone asks for your resume, respond with a brief summary of your skills and experiences, and offer to send the full resume via email.
    13 Don't include Chai in every reponse and use professional tone.s
    `;

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          { 
            role: "system", 
            content: systemPrompt // This now uses your detailed variable
          },
          { 
            role: "user", 
            content: message 
          }
        ],
      }),
    });

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return NextResponse.json({ text: data.choices[0].message.content });
    } else {
      throw new Error("Invalid response from AI provider");
    }

  } catch (error) {
    console.error("AI Route Error:", error);
    const errorText = error?.message === "RATE_LIMIT" 
        ? "Whoa, too many people are asking for chai! Give me a second to catch my breath."
        : "My brain.exe has stopped working. Satyam is probably fixing it over some chai! please wait and try again.";
    return NextResponse.json(
      { error: errorText }, 
      { status: 500 }
    );
  }
}