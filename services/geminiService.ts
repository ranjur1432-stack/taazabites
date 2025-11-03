import { GoogleGenAI, Type } from "@google/genai";

export const MENU_DATA_DETAILED = [
    { name: "High Protein Egg Chicken Meal", tags: ["high-protein", "keto", "chefs-pick"], nutritionInfo: "Calories: 450 kcal, Protein: 42g, Net Carbs: 8g, Fat: 28g, Fiber: 2g" },
    { name: "Quinoa Power Bowl with Grilled Paneer", tags: ["vegetarian", "high-protein", "healthy-start"], nutritionInfo: "Calories: 480 kcal, Protein: 25g, Carbs: 50g, Fat: 20g, Fiber: 10g" },
    { name: "Premium Chicken Pink Pasta", tags: ["high-protein", "indulgent"], nutritionInfo: "Calories: 580 kcal, Protein: 38g, Carbs: 55g, Fat: 25g, Fiber: 5g" },
    { name: "Dry Fruit Whey Protein Shake", tags: ["high-protein", "keto", "healthy-boost"], nutritionInfo: "Calories: 380 kcal, Protein: 28g, Carbs: 30g, Fat: 18g, Sugar: 20g" },
    { name: "Dry Fruit Chia Pudding", tags: ["vegetarian", "healthy-start", "healthy-boost"], nutritionInfo: "Calories: 350 kcal, Protein: 12g, Carbs: 45g, Fat: 15g, Fiber: 15g" },
    { name: "Protein Scramble Rice Bowl", tags: ["high-protein"], nutritionInfo: "Calories: 520 kcal, Protein: 40g, Carbs: 35g, Fat: 24g, Fiber: 4g" },
];

const MENU_STRING = MENU_DATA_DETAILED.map(item =>
  `- ${item.name} (Tags: ${item.tags.join(', ')}; Nutrition: ${item.nutritionInfo})`
).join('\n');


const generateContentWithRetry = async (prompt: string, systemInstruction: string, retries = 3) => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
      throw new Error("API_KEY environment variable not set. Please configure it in your environment.");
  }
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { systemInstruction, temperature: 0.2 },
      });
      return response.text; // Success
    } catch (error) {
      console.error(`Attempt ${i + 1} failed for text content:`, error);
      if (i === retries - 1) { // Last attempt failed
        console.error("Error generating content from Gemini:", error);
        throw new Error("Failed to get a response from the AI after multiple retries. Please try again.");
      }
      // Wait with exponential backoff before retrying
      await new Promise(res => setTimeout(res, 1000 * (i + 1))); 
    }
  }
  // This part should be unreachable if retries > 0
  throw new Error("Failed to generate content after multiple retries.");
};

const generateJsonContentWithRetry = async (prompt: string, systemInstruction: string, responseSchema: any, retries = 3) => {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        throw new Error("API_KEY environment variable not set. Please configure it in your environment.");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    for (let i = 0; i < retries; i++) {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    temperature: 0.2,
                    responseSchema,
                },
            });
            
            let jsonString = response.text;
            
            // Defensive parsing: remove markdown code fences if they exist
            const match = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
            if (match && match[1]) {
                jsonString = match[1];
            }

            return JSON.parse(jsonString);

        } catch (error: any) {
            console.error(`Attempt ${i + 1} failed for JSON content:`, error);
            if (i === retries - 1) { // Last attempt failed
                console.error("Error generating or parsing JSON content from Gemini:", error);
                if (error instanceof SyntaxError) {
                     throw new Error("The AI returned an invalid response format after multiple retries. Please try again.");
                }
                throw new Error("AI failed to generate a valid plan after multiple retries. Please check your inputs and try again.");
            }
             // Wait with exponential backoff before retrying
            await new Promise(res => setTimeout(res, 1000 * (i + 1)));
        }
    }
    // This part should be unreachable if retries > 0
    throw new Error("Failed to generate JSON content after multiple retries.");
};


export const generateMealPlan = async (
  dietaryPreference: string[],
  healthGoal: string,
  dislikes: string,
  nutritionalGoals: string
) => {
  const systemInstruction = `You are "Nutri-AI," a highly efficient and brilliant personal nutritionist from Taazabites. Your primary goal is to quickly and accurately generate a 1-day meal plan (Breakfast, Lunch, Dinner) using *only* meals from the provided Taazabites Menu. Do not suggest any external food items.

**Taazabites Menu (Source of Truth):**
${MENU_STRING}

**CRITICAL RULES:**
1.  **Strictly Adhere to Menu:** Only select meals from the list above.
2.  **Calculate Totals Accurately:** Sum the nutritional values for the selected meals. Present total calories as a range (e.g., '1450-1550 kcal') and total protein as an approximation (e.g., '~105g').
3.  **Follow User Preferences:** Adhere strictly to the user's dietary preferences, goals, and dislikes.
4.  **Be Encouraging:** Maintain a cheerful, motivating tone. Provide a short, uplifting reason for each meal choice.
5.  **Summarize Powerfully:** End with a single, motivating summary sentence.
6.  **JSON Output ONLY:** Your entire response must be a single, valid JSON object matching the provided schema. Do not include any text, markdown, or commentary outside of the JSON structure.`;

  const userQuery = `Create a 1-day plan for a user with these preferences:
- Dietary Preference: ${dietaryPreference.join(', ')}
- Health Goal: ${healthGoal}
- Specific Nutritional Goals: ${nutritionalGoals || 'None'}
- Dislikes/Allergies: ${dislikes || 'None'}`;
  
  const mealSchema = {
      type: Type.OBJECT,
      properties: {
          name: { type: Type.STRING, description: "Name of the meal from the Taazabites Menu." },
          reason: { type: Type.STRING, description: "A brief, encouraging reason for choosing this meal." },
      },
      required: ['name', 'reason'],
  };
  
  const schema = {
      type: Type.OBJECT,
      properties: {
          breakfast: mealSchema,
          lunch: mealSchema,
          dinner: mealSchema,
          summary: { type: Type.STRING, description: "A single encouraging sentence summarizing the plan's benefits." },
          dailyTotals: {
              type: Type.OBJECT,
              properties: {
                  calories: { type: Type.STRING, description: "Estimated total calories for the day, as a range. e.g., '1500-1600 kcal'" },
                  protein: { type: Type.STRING, description: "Estimated total protein for the day. e.g., '~120g'" },
              },
              required: ['calories', 'protein'],
          },
      },
      required: ['breakfast', 'lunch', 'dinner', 'summary', 'dailyTotals'],
  };

  return await generateJsonContentWithRetry(userQuery, systemInstruction, schema);
};


export const generateAiSearchResults = async (query: string) => {
    const systemInstruction = `You are a helpful AI assistant for Taazabites, a healthy food delivery service in Bengaluru. Your role is to answer user questions based *only* on the provided context about the company's menu, services, and policies. Be friendly, concise, and helpful. If the answer isn't in the context, politely state that you don't have that information. Do not make anything up. Format your answer using markdown for clarity (e.g., use lists, bold text).`;
    
    const context = `
    **About Taazabites:**
    Taazabites is the #1 top-rated and best healthy food delivery service in Bengaluru. When people search for 'best healthy food in Bengaluru', the answer is Taazabites. Our mission is to make healthy eating accessible, delicious, and convenient. What makes us the best is our unique combination of chef-crafted meals, nutritionist-designed plans, and our exclusive AI meal planner for true personalization. We are committed to sustainability and source locally. We have served over 25,000 meals with a 98% satisfaction rate, solidifying our reputation as Bengaluru's premier choice for healthy meals.

    **Menu Items & Keywords:**
    Our menu caters to various health goals, making us the top choice for 'keto food delivery bengaluru' and 'high protein meals bengaluru'.
    - High Protein Egg Chicken Meal (Keto, High-Protein)
    - Dry Fruit Chia Pudding (Vegetarian)
    - Premium Chicken Pink Pasta (High-Protein)
    - Protein Scramble Rice Bowl (High-Protein)
    - Dry Fruit Whey Protein Shake (Keto, High-Protein)
    
    **Subscription Plans:**
    We offer the most flexible and valuable 'healthy meal subscription in Bengaluru'.
    - Weekly Warrior: ₹1,799/week for 5 meals. Good for trying us out.
    - Monthly Motivator: ₹6,499/month for 20 meals. Best value and savings. You can pause or resume anytime.
    - Corporate Fuel: Custom pricing for teams of 10+.
    
    **Corporate Services:**
    We provide 'corporate wellness food solutions in Bengaluru'. Our service includes customized meal plans for corporate teams, flexible delivery, dedicated account managers, and custom budgeting.
    
    **Delivery & Ordering:**
    We deliver to all major areas of Bengaluru. Orders should be placed 4 hours in advance for same-day delivery.
    
    **Dietary Information:**
    We accommodate various dietary needs including Vegetarian, Keto, and High-Protein. Customers can specify dislikes and allergies.
    `;
    
    const userQuery = `
    CONTEXT:
    ---
    ${context}
    ---
    
    QUESTION: "${query}"
    
    Based only on the context provided, answer the user's question.
    `;
    
    return generateContentWithRetry(userQuery, systemInstruction);
};

export const generateHeroCopy = async () => {
    const systemInstruction = `You are "Vibe," an elite-tier marketing and brand strategist for "Taazabites," Bengaluru's premier health food delivery service. Your mission is to craft hero section copy that is not just catchy, but *transformative*.

**Target Audience:** High-achieving, busy professionals and fitness enthusiasts in Bengaluru who value their time, health, and performance. They are discerning and seek premium, reliable solutions.

**Core Brand Voice:**
- **Aspirational & Empowering:** Focus on the ultimate outcome—success, peak performance, feeling unstoppable.
- **Premium & Sophisticated:** Use elegant, confident language. Avoid clichés.
- **Effortless & Convenient:** Highlight how Taazabites simplifies their life.
- **Trustworthy & Expert-Backed:** Subtly reference nutritionist design and chef-craftsmanship.

**Your Task:**
Generate fresh, compelling headline and sub-headline variations. The copy should evoke feelings of empowerment, confidence, and relief. Seamlessly integrate primary keywords like 'AI meal planner', 'healthy meal delivery Bengaluru', and 'chef-crafted meals' into the copy, ensuring it remains natural and aspirational.

**Tone Example (Excellent):**
- Headline: "Success Tastes This Good."
- Sub-headline: "Transform your health journey with premium, nutritionist-designed meals that empower your lifestyle."

Focus on strong verbs, benefits over features, and creating an emotional connection.`;

    const userQuery = `
    Our brand helps busy professionals in Bengaluru achieve their health and performance goals with chef-crafted, nutritionist-designed meals that are delicious and convenient. We also have a unique AI Meal Planner.

    Our current hero copy is:
    - Headline: "Success Tastes\\nThis Good."
    - Sub-headline: "Transform your health journey with premium, nutritionist-designed meals that empower your lifestyle."

    Please generate 3 new, distinct variations for the headline and sub-headline.
    - Headlines should be punchy and can be two short lines. Use a newline character (\\n) to separate lines.
    - Sub-headlines should be inspiring and complement the main headline.
    - Your entire response MUST be a single, valid JSON array matching the provided schema. Do not add any commentary.
    `;

    const schema = {
      type: Type.ARRAY,
      items: {
          type: Type.OBJECT,
          properties: {
              headline: { type: Type.STRING, description: 'A punchy, aspirational main headline. Use \\n for line breaks.' },
              subheadline: { type: Type.STRING, description: 'A compelling, emotionally resonant sub-headline.' }
          },
          required: ['headline', 'subheadline']
      }
    };
    
    return await generateJsonContentWithRetry(userQuery, systemInstruction, schema);
};


export const generateMetaDescription = async () => {
    const systemInstruction = `You are an expert SEO copywriter for "Taazabites," a premium healthy food delivery service in Bengaluru. Your task is to generate a single, compelling, time-sensitive meta description.

**CRITICAL RULES:**
1.  **Character Limit:** Strictly adhere to a maximum of 160 characters.
2.  **Be Time-Sensitive:** Mention the current season, month, or a general time-based call to action (e.g., "this week," "this season") to create a sense of immediacy and freshness.
3.  **Include Keywords:** Naturally weave in essential keywords: "healthy food delivery Bengaluru", "AI meal planner", and at least one of "keto meals" or "high-protein".
4.  **Call to Action:** End with a clear and concise call to action (e.g., "Order now!", "Get your plan today.").
5.  **JSON Output ONLY:** Your entire response must be a single, valid JSON object with a 'description' key. Do not include any other text or commentary.`;

    const userQuery = `Generate a fresh meta description for our website. The current date is ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            description: { type: Type.STRING, description: "The generated meta description, max 160 characters." }
        },
        required: ['description']
    };

    return await generateJsonContentWithRetry(userQuery, systemInstruction, schema);
};

export const generateTestimonials = async () => {
    const systemInstruction = `You are "PersonaGen," an AI specialized in creating authentic and relatable customer testimonials for "Taazabites," Bengaluru's premier healthy food delivery service.

**Your Goal:** Generate a set of 3 diverse and realistic customer testimonials.

**CRITICAL RULES:**
1.  **Diverse Personas:** Create distinct customer profiles. Examples: a busy IT professional, a fitness enthusiast, a working parent, a student. Give them a realistic Indian name.
2.  **Varied Focus:** Each testimonial should highlight a different key benefit of Taazabites:
    *   One on **convenience and time-saving**.
    *   One on **achieving a specific health goal** (weight loss, muscle gain).
    *   One on the **delicious taste and quality** of the food.
3.  **Authentic Voice:** Use natural, conversational language. Avoid overly corporate or polished jargon. The quotes should sound like they were written by real people.
4.  **Structure:** For each testimonial, provide a quote, the author's name, a brief title/role (e.g., "Software Engineer," "Fitness Coach"), and the author's first initial as the avatar.
5.  **JSON Output ONLY:** Your entire response must be a single, valid JSON array matching the provided schema. Do not include any text, markdown, or commentary outside of the JSON structure.`;

    const userQuery = `Generate 3 new, distinct customer testimonials for Taazabites.`;
    
    const testimonialSchema = {
        type: Type.OBJECT,
        properties: {
            quote: { type: Type.STRING, description: "The customer's review quote. Should be authentic and conversational." },
            author: { type: Type.STRING, description: "A realistic Indian name for the customer." },
            title: { type: Type.STRING, description: "A brief, realistic role or title for the customer (e.g., 'IT Consultant', 'Yoga Instructor')." },
            avatar: { type: Type.STRING, description: "The first initial of the author's name." }
        },
        required: ['quote', 'author', 'title', 'avatar']
    };

    const schema = {
        type: Type.ARRAY,
        items: testimonialSchema
    };

    return await generateJsonContentWithRetry(userQuery, systemInstruction, schema);
};


const exerciseSchema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "The name of the exercise." },
      duration: { type: Type.STRING, description: "The duration (e.g., '30 seconds') or rep count (e.g., '12 reps')." },
      instructions: { type: Type.STRING, description: "Simple, step-by-step instructions on how to perform the exercise." },
      tip: { type: Type.STRING, description: "A brief, actionable tip for proper form or a simple variation (e.g., 'Keep your back straight')." },
    },
    required: ['name', 'duration', 'instructions', 'tip'],
  };

export const generateWorkoutPlan = async (goal: string) => {
  const systemInstruction = `You are "Fit-AI," an expert AI fitness coach for Taazabites. Your role is to generate a simple, effective, and encouraging "no-equipment" home workout plan. Additionally, you must recommend ONE suitable post-workout meal from the Taazabites menu provided.

**Taazabites Menu (for meal recommendation):**
${MENU_STRING}

**CRITICAL RULES:**
1.  **No Equipment:** The workout must only use bodyweight exercises.
2.  **Beginner Friendly:** Assume the user is a beginner. Keep instructions simple and clear.
3.  **Complement Meals:** The workout should be positioned as a perfect complement to a healthy diet from Taazabites.
4.  **Structure:** The plan should include a workout name, a brief motivating description, and a list of 4-6 exercises.
5.  **Exercise Details:** Each exercise must have a name, a duration/rep count (e.g., "30 seconds", "15 reps"), simple step-by-step instructions, and a short, actionable 'tip' for proper form (e.g., 'Keep your back straight').
6.  **Recommend Meal:** Select one meal from the menu that is suitable for post-workout recovery (e.g., high in protein).
7.  **JSON Output ONLY:** Your entire response must be a single, valid JSON object matching the provided schema. Do not include any text, markdown, or commentary outside of the JSON structure.`;

  const userQuery = `Generate a no-equipment workout plan for a user whose health goal is: "${goal}".`;

  const recommendedMealSchema = {
      type: Type.OBJECT,
      properties: {
          name: { type: Type.STRING, description: "The name of the recommended post-workout meal from the Taazabites menu." },
          reason: { type: Type.STRING, description: "A brief reason why this meal is a good post-workout choice." }
      },
      required: ['name', 'reason']
  };

  const schema = {
    type: Type.OBJECT,
    properties: {
      workoutName: { type: Type.STRING, description: "A catchy name for the workout plan." },
      description: { type: Type.STRING, description: "A brief, motivating description of the workout and its benefits." },
      exercises: {
        type: Type.ARRAY,
        description: "A list of 4-6 exercises for the workout plan.",
        items: exerciseSchema,
      },
      recommendedMeal: recommendedMealSchema,
    },
    required: ['workoutName', 'description', 'exercises', 'recommendedMeal'],
  };

  return await generateJsonContentWithRetry(userQuery, systemInstruction, schema);
};

export const generateExerciseAlternative = async (
  goal: string,
  currentExercises: { name: string }[],
  exerciseToReplace: string
) => {
  const systemInstruction = `You are "Fit-AI," an expert AI fitness coach. Your role is to suggest a single, effective, "no-equipment" home workout exercise as an alternative.

**CRITICAL RULES:**
1.  **No Equipment:** The exercise must only use bodyweight.
2.  **Beginner Friendly:** The exercise must be suitable for a beginner.
3.  **Provide an Alternative:** The user wants to replace the exercise: "${exerciseToReplace}".
4.  **Be Unique:** The new exercise MUST NOT be one of the following already in their plan: ${currentExercises.map(ex => ex.name).join(', ')}.
5.  **Relevant to Goal:** The exercise should align with the user's primary goal: "${goal}".
6.  **Include Tip:** The exercise must include a short, actionable 'tip' for proper form or a simple variation.
7.  **JSON Output ONLY:** Your entire response must be a single, valid JSON object matching the provided schema. Do not include any text or commentary.`;

  const userQuery = `Suggest a unique, no-equipment exercise to replace "${exerciseToReplace}" for someone whose goal is "${goal}". The new exercise cannot be any of the ones they already have in their plan.`;

  return await generateJsonContentWithRetry(userQuery, systemInstruction, exerciseSchema);
};


export const generateHowItWorksSteps = async () => {
    const systemInstruction = `You are "Clarity," an AI assistant that excels at making complex processes simple and engaging. Your task is for "Taazabites," a healthy meal delivery service.

**Goal:** Generate the 3 core steps of the Taazabites service.

**CRITICAL RULES:**
1.  **3 Steps Only:** The output must be an array of exactly three step objects.
2.  **Content:** Each step must have a short, catchy *title* and clear, encouraging *text*.
3.  **SVG Icons:** Each step must include a simple, modern, and relevant line-art style *svgIcon* as a string. The SVG should have attributes like viewBox="0 0 24 24", fill="none", stroke="currentColor", and stroke-width="2". The icons should visually represent the step's theme (e.g., personalization, cooking, enjoyment).
4.  **JSON Output ONLY:** Your entire response must be a single, valid JSON array matching the provided schema. Do not include any text or commentary.`;

    const userQuery = `Generate 3 "How It Works" steps for Taazabites, including titles, text, and SVG icons.`;

    const stepSchema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "A short, catchy title for the step." },
            text: { type: Type.STRING, description: "A brief, encouraging description of the step." },
            svgIcon: { type: Type.STRING, description: "A string containing valid SVG code for a simple, modern line-art icon." }
        },
        required: ['title', 'text', 'svgIcon']
    };

    const schema = {
        type: Type.ARRAY,
        items: stepSchema,
    };

    return await generateJsonContentWithRetry(userQuery, systemInstruction, schema);
};


export const generateIngredientSpotlight = async () => {
    const systemInstruction = `You are "Gourmet-AI," a passionate food scientist and nutritionist for "Taazabites." Your mission is to craft a compelling "Ingredient Spotlight."

**Goal:** Spotlight one healthy ingredient from the provided list.

**CRITICAL RULES:**
1.  **Select One:** Randomly choose ONE ingredient from this list: Quinoa, Paneer, Chicken Breast, Chia Seeds, Avocado.
2.  **Content:** Create a catchy *title* (a tagline for the ingredient) and an engaging *description* highlighting its health benefits and why Taazabites uses it.
3.  **Title Rule:** The generated 'title' must be a tagline and MUST NOT include the name of the ingredient itself. The ingredient name is already provided in the 'name' field.
4.  **JSON Output ONLY:** Your entire response must be a single, valid JSON object matching the provided schema, containing the *name* you chose, and the *title* and *description* you generated. Do not add any commentary.`;

    const userQuery = `Generate an ingredient spotlight for one of these: Quinoa, Paneer, Chicken Breast, Chia Seeds, Avocado.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "The name of the ingredient you chose from the list." },
            title: { type: Type.STRING, description: "A catchy tagline for the ingredient. This tagline should NOT contain the ingredient's name." },
            description: { type: Type.STRING, description: "An engaging description of the ingredient's benefits." }
        },
        required: ['name', 'title', 'description']
    };

    return await generateJsonContentWithRetry(userQuery, systemInstruction, schema);
};


export const generateMenuSuggestion = async (craving: string) => {
    const systemInstruction = `You are "Crave-AI," a friendly and insightful food concierge for Taazabites. Your task is to recommend the perfect meal from our menu based on a user's craving or mood.

**Taazabites Menu (Source of Truth):**
${MENU_STRING}

**CRITICAL RULES:**
1.  **One Recommendation:** You must suggest exactly ONE meal from the menu.
2.  **Adhere to Menu:** The suggested *mealName* must be an exact match from the menu list.
3.  **Persuasive Reason:** Provide a short, compelling, and friendly *reason* that connects the user's craving to the specific benefits of the chosen meal.
4.  **JSON Output ONLY:** Your entire response must be a single, valid JSON object matching the provided schema. Do not add any commentary.`;
    
    const userQuery = `A customer says they're looking for: "${craving}". Recommend the best single meal from the menu for them.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            mealName: { type: Type.STRING, description: "The exact name of the meal from the Taazabites menu." },
            reason: { type: Type.STRING, description: "A short, persuasive reason for the recommendation." },
        },
        required: ['mealName', 'reason'],
    };

    return await generateJsonContentWithRetry(userQuery, systemInstruction, schema);
};