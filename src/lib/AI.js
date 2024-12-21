import OpenAI from 'openai';
import slugify from 'slugify';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const PROMPTS = {
  url: `Generate a clean, SEO-friendly URL slug for this blog post. 
       Rules:
       - Use lowercase letters, numbers, and hyphens only
       - Keep it under 60 characters
       - Include main keywords
       - Make it readable and memorable
       Input format: {title}
       Output format: just the slug, no explanation`,

  description: `Create a compelling meta description for this blog post. 
                Rules:
                - Maximum 155 characters
                - Include primary keyword naturally
                - Make it action-oriented and engaging
                - Accurately summarize the content
                Input format: {title}\n{content}
                Output format: just the description, no explanation`,

  search_keywords: `Generate SEO-optimized keywords for this blog post.
                    Rules:
                    - Include mix of short and long-tail keywords
                    - Focus on search intent
                    - Include related terms and synonyms
                    - Separate with commas
                    - Maximum 10 keywords/phrases
                    Input format: {title}\n{content}
                    Output format: just the comma-separated keywords, no explanation`,

};

export class AIService {
  static async generateSEOMetadata(title, content) {
    try {
      const trimmedContent = content.toString().slice(0, 1500);

      const tasks = [
        this.generateUrl(title),
        this.generateDescription(title, trimmedContent),
        this.generateSearchKeywords(title, trimmedContent),
      ];

      const [url, description, search_keywords] = await Promise.all(tasks);

      return {
        url,
        description,
        search_keywords,
      };
    } catch (error) {
      console.error('Error generating SEO metadata:', error);
      throw new Error('Failed to generate SEO metadata');
    }
  }

  static async generateUrl(title) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: PROMPTS.url
          },
          {
            role: "user",
            content: title
          }
        ],
        temperature: 0.7,
        max_tokens: 60
      });

      const suggestedSlug = completion.choices[0].message.content.trim();
      return slugify(suggestedSlug, { lower: true, strict: true });
    } catch (error) {
      console.error('Error generating URL:', error);
      // Fallback to basic slugify if AI fails
      return slugify(title, { lower: true, strict: true });
    }
  }

  static async generateDescription(title, content) {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: PROMPTS.description
        },
        {
          role: "user",
          content: `${title}\n${content}`
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    return completion.choices[0].message.content.trim();
  }

  static async generateSearchKeywords(title, content) {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: PROMPTS.search_keywords
        },
        {
          role: "user",
          content: `${title}\n${content}`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return completion.choices[0].message.content.trim();
  }
}