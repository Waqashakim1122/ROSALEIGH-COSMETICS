const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// This prompt controls both accuracy and safety. Edit wording freely,
// but keep the JSON shape in sync with the parsing logic below.
const ANALYSIS_PROMPT = `You are analyzing a selfie photo for a skincare brand's skin test tool.
Respond with ONLY a JSON object. No other text, no markdown fences, no explanation.

Follow these rules exactly:

1. First check whether the image clearly shows a real human face suitable for skin
   analysis. Random objects, pets, blurry photos, screenshots, or images with no
   visible face are NOT valid.

2. Estimate the person's age bracket as one of: "under_13", "13_17", "18_plus", "unknown".
   Be conservative: if the person could plausibly be under 18, do not mark them as "18_plus".

3. Only if the face is valid AND the age bracket is "18_plus", assess these three
   attributes, each as "low", "medium", or "high":
   - dryness
   - redness
   - oiliness
   Base this only on visible skin texture, tone, and shine. Do not comment on age,
   attractiveness, or anything unrelated to dryness/redness/oiliness.

4. Return a confidence level for the overall read: "low", "medium", or "high".

Return exactly this JSON shape and nothing else:
{
  "valid_face_detected": true or false,
  "age_bracket": "under_13" | "13_17" | "18_plus" | "unknown",
  "skin": { "dryness": "low"|"medium"|"high", "redness": "low"|"medium"|"high", "oiliness": "low"|"medium"|"high" } or null,
  "confidence": "low" | "medium" | "high"
}

If valid_face_detected is false, or age_bracket is not "18_plus", set "skin" to null.`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed.' });
  }

  try {
    const { imageData, mediaType } = req.body || {};

    if (!imageData || !mediaType) {
      return res.status(400).json({ status: 'error', message: 'Please upload a photo.' });
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(mediaType)) {
      return res.json({ status: 'retry', message: 'Please upload a JPG, PNG, or WEBP photo.' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001', // cheapest current model, well suited to this task
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageData } },
            { type: 'text', text: ANALYSIS_PROMPT }
          ]
        }
      ]
    });

    const rawText = response.content.find(block => block.type === 'text')?.text || '';
    const cleaned = rawText.replace(/```json|```/g, '').trim();

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Failed to parse model output:', rawText);
      return res.json({
        status: 'retry',
        message: "We couldn't read that photo clearly. Please try again with a well-lit selfie."
      });
    }

    if (!result.valid_face_detected) {
      return res.json({
        status: 'retry',
        message: "We couldn't detect a clear face in that photo. Please upload a well-lit selfie facing the camera."
      });
    }

    if (result.age_bracket === 'under_13' || result.age_bracket === '13_17') {
      return res.json({
        status: 'restricted',
        message: "Our AI skin test is designed for adult skin and isn't intended for anyone under 18. If you're a parent shopping for a younger person, feel free to contact us directly, or use the quiz instead of the photo step."
      });
    }

    if (result.age_bracket === 'unknown' || result.confidence === 'low') {
      return res.json({
        status: 'retry',
        message: "We couldn't get a confident read from that photo. Please try again in better lighting, facing the camera directly."
      });
    }

    return res.json({ status: 'ok', skin: result.skin });

  } catch (err) {
    console.error('Skin analysis error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong analyzing your photo. Please try again.'
    });
  }
};