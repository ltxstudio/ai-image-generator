'use client'; // Add this at the top to make this a client-side component

import { useState } from 'react';
import { PaperClipIcon, RefreshIcon } from '@heroicons/react/20/solid';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateImage = async () => {
    setLoading(true);
    setError('');
    try {
      // Make API request to Cloudflare AI model directly from the client
      const response = await fetch('https://api.cloudflare.com/client/v4/accounts/YOUR_CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer YOUR_CLOUDFLARE_API_TOKEN`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      const data = await response.json();
      if (data.result) {
        setImageUrl(data.result); // The result is the image URL
      } else {
        setError('Failed to generate image');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error generating image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-10 px-5">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6">AI Image Generator</h1>
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-lg font-medium mb-2">
            Enter a prompt:
          </label>
          <input
            id="prompt"
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. cyberpunk cat"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <div className="flex justify-center mb-6">
          <button
            onClick={handleGenerateImage}
            disabled={loading}
            className="flex items-center bg-blue-500 text-white p-3 rounded-lg shadow hover:bg-blue-600 focus:outline-none disabled:bg-gray-400"
          >
            {loading ? (
              <RefreshIcon className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <PaperClipIcon className="w-5 h-5 mr-2" />
            )}
            {loading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {imageUrl && (
          <div className="text-center">
            <img src={imageUrl} alt="Generated Image" className="w-full h-auto max-w-md mx-auto rounded-lg shadow-lg" />
          </div>
        )}
      </div>
    </div>
  );
}
