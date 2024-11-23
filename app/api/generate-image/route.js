import axios from 'axios';

export async function POST(req) {
  const { prompt } = await req.json();

  if (!prompt) {
    return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
  }

  try {
    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        },
      }
    );

    const imageUrl = response.data.result; // Assuming `result` contains the URL
    return new Response(JSON.stringify({ imageUrl }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to generate image' }), { status: 500 });
  }
}
