import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env.ts';
import { logger } from '../config/logger.ts';
import { ChatSession, ChatMessage } from '../models/ChatSession.ts';

export class AiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (config.geminiApiKey) {
      this.ai = new GoogleGenAI({
        apiKey: config.geminiApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build-mentoraai',
          },
        },
      });
    }
  }

  async generateCareerAdvice(options: {
    message: string;
    history?: Array<{ role: string; content: string }>;
    studentProfile?: any;
    sessionId?: string;
  }) {
    const { message, history = [], studentProfile } = options;

    const systemInstruction = `You are MentoraAI, a knowledgeable, empathetic AI Career & Education Advisor built for Smart India Hackathon 2025 (Problem Statement ID: 25094, Team Code Jesters).
Your mission is to reduce student dropouts (which stand at 11.5% after Class 10 according to UDISE+, affecting 42.7 lakh students) by providing clear, personalized, actionable guidance for students after 10th, 12th, and Graduation.

Guidelines:
- Recommend verified Indian government pathways: NEP 2020 flexible curriculum, CBSE/State Boards, Polytechnic 3-year diplomas (subsidized ~₹4,800/yr, immediate jobs or lateral direct entry to 2nd year B.Tech), ITI courses.
- Top government institutions: IITs, NIT Srinagar, GMC Jammu, DU SRCC, COEP Pune, Government Polytechnic colleges.
- Government Scholarships: PMSSS (Prime Minister's Special Scholarship Scheme for J&K/Ladakh students with 100% fee waiver + ₹1 Lakh/yr maintenance), Central Sector Scholarship, Pragati Girls Scholarship, Post-Matric SC/ST/OBC schemes.
- Tone: Encouraging, realistic, practical, structured. Address financial challenges with concrete government solutions.
- Do NOT use emojis. Maintain a clear, clean academic tone.
${studentProfile ? `Current Student Profile Context: ${JSON.stringify(studentProfile)}` : ''}`;

    let replyText = '';

    if (this.ai) {
      try {
        const contents: any[] = [];
        for (const msg of history.slice(-6)) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          });
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await this.ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        replyText = response.text || '';
      } catch (err: any) {
        logger.warn('Gemini API call warning:', { error: err?.message });
      }
    }

    if (!replyText) {
      const lower = message.toLowerCase();
      if (lower.includes('10th') || lower.includes('drop') || lower.includes('stream')) {
        replyText = `Recommendations for Post-Class 10 Decision Making:

1. Financial Security and Education Continuity:
   Government Polytechnic colleges offer 3-year diplomas at less than 4,800 rupees per year with guaranteed industrial training and hands-on skill development.

2. Stream Choice Matrix:
   - Science (PCM): Recommended for analytical students aiming for B.Tech, Architecture, or Defense (NDA).
   - Science (PCB): Recommended for MBBS, BDS, Nursing, Veterinary, and Biotech careers.
   - Commerce: Recommended for banking, chartered accountancy, corporate finance, and business management.
   - Polytechnic Diploma: Practical hands-on option with immediate employment opportunities or direct lateral entry into 2nd year B.Tech.

3. Scholarships:
   Explore the PMSSS scheme (covers 100% college tuition plus 1,00,000 rupees per year maintenance allowance) and Central Sector NSP schemes.

You can take our 3-minute Scientific Assessment to match your aptitudes.`;
      } else if (lower.includes('pmsss') || lower.includes('scholarship') || lower.includes('fee')) {
        replyText = `Key Government Scholarships to Eliminate Financial Hardship:

1. PMSSS (Prime Minister's Special Scholarship Scheme for J&K & Ladakh):
   - Eligibility: Family income under 8.00 Lakhs per annum with 10th or 12th from J&K/Ladakh.
   - Coverage: Up to 1.25 Lakhs academic fees reimbursed directly to college plus 1,00,000 rupees per year hostel maintenance stipend.

2. Pragati Scholarship for Girls (AICTE):
   - 50,000 rupees per year for female scholars pursuing technical degrees or polytechnic diplomas.

3. Central Sector Scheme:
   - For students scoring in top 20th percentile in board exams, with direct DBT transfer.

You can track active deadlines directly in our Scholarships portal.`;
      } else {
        replyText = `Welcome to MentoraAI Advisory.

I am here to ensure every student has clear, objective guidance to avoid educational discontinuation.
Whether you want to know:
- Which academic stream fits your profile after 10th or 12th
- How to get into government colleges with low fees
- How to predict admission chances with your rank or board marks
- Which scholarships match your family income

Please let me know your current grade, favorite subjects, and career goals.`;
      }
    }

    return replyText;
  }

  async synthesizeSpeech(text: string, voiceName: string = 'Kore') {
    if (!this.ai) {
      return { useWebSpeech: true };
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [{ text: text.slice(0, 400) }],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return { audioBase64: base64Audio, format: 'audio/wav' };
      }
    } catch (err: any) {
      logger.warn('Gemini TTS warning:', { error: err?.message });
    }

    return { useWebSpeech: true };
  }
}

export const aiService = new AiService();
