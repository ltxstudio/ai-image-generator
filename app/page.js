'use client'; // Ensure this is a client-side component

import { useState } from 'react';
import { PaperClipIcon, RefreshIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion'; // Import framer-motion for animations

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateImage = async () => {
    setLoading(true);
    setError('');
    try {
      // Use environment variables for the Cloudflare credentials
      const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN}`,
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
      <motion.div
        className="max-w-xl w-full bg-white rounded-lg shadow-md p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center mb-6">AI Image Generator</h1>
        
        {/* Input Field for the Prompt */}
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

        {/* Button for generating the image */}
        <div className="flex justify-center mb-6">
          <motion.button
            onClick={handleGenerateImage}
            disabled={loading}
            className="flex items-center bg-blue-500 text-white p-3 rounded-lg shadow hover:bg-blue-600 focus:outline-none disabled:bg-gray-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <RefreshIcon className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <PaperClipIcon className="w-5 h-5 mr-2" />
            )}
            {loading ? 'Generating...' : 'Generate Image'}
          </motion.button>
        </div>

        {/* Error message */}
        {error && (
          <motion.p
            className="text-red-500 text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </motion.p>
        )}

        {/* Display generated image */}
        {imageUrl && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={imageUrl}
              alt="Generated Image"
              className="w-full h-auto max-w-md mx-auto rounded-lg shadow-lg"
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
