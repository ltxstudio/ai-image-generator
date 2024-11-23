import axios from 'axios';

export async function POST(req) {
  // Parse request body
  const { prompt } = await req.json();

  // Validate prompt
  if (!prompt) {
    return new Response(
      JSON.stringify({ error: 'Prompt is required' }),
      { status: 400 }
    );
  }

  try {
    // Send request to Cloudflare AI API for image generation
    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
      {
        prompt: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const imageUrl = response.data.result; // Assuming the response contains an image URL

    return new Response(JSON.stringify({ imageUrl }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate image' }),
      { status: 500 }
    );
  }
}
