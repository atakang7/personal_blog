import { v4 as uuidv4 } from 'uuid';
import { Octokit } from '@octokit/core';  // Changed back to core
import formidable from 'formidable';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false
  }
};

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'atakang7';
const REPO_NAME = 'blog-static';
const BASE_URL = 'https://static.atakangul.com/uploads';

if (!GITHUB_TOKEN) {
  throw new Error('GITHUB_TOKEN is not configured');
}

const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

async function uploadToGitHub(buffer, filename) {
  try {
    const content = buffer.toString('base64');

    const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: `uploads/${filename}`,
      message: `Upload ${filename}`,
      content: content,
      committer: {
        name: 'Blog Upload Bot',
        email: 'bot@atakangul.com'
      },
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return `${BASE_URL}/${filename}`;
  } catch (error) {
    console.error('GitHub upload error:', error);
    throw new Error('Failed to upload to GitHub');
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024,
      filter: ({ mimetype }) => {
        return mimetype && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(mimetype);
      }
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = files.image?.[0];
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const buffer = await fs.readFile(file.filepath);
    const url = await uploadToGitHub(buffer, file.newFilename);

    // Cleanup temp file
    await fs.unlink(file.filepath).catch(console.error);

    return res.status(200).json({ url });
  } catch (error) {
    console.error('Upload handler error:', error);
    return res.status(500).json({ 
      error: 'Upload failed', 
      message: error.message 
    });
  }
}