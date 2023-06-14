const User = require('../models/user');
const { Octokit } = require('@octokit/rest');
const fs = require('fs');
require('dotenv').config();

const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

const UserController = {
  createUser: async (req, res) => {
    const { name, email, password } = req.body;
    const { path: tempPath, originalname } = req.file;

    try {
      // Upload profile image to GitHub repository
      const { data } = await octokit.repos.createOrUpdateFileContents({
        owner: process.env.GITHUB_USERNAME,
        repo: process.env.GITHUB_REPOSITORY,
        path: `profile_images/${originalname}`,
        message: 'Add profile image',
        content: fs.readFileSync(tempPath, 'base64'),
      });
  console.log(data,'data')
      // Create user in MongoDB
      const user = new User({
        name,
        email,
        password,
        imageUrl: data.content.html_url,
      });
      await user.save();

      res.status(201).json({message: 'User created successfully' });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      // Remove the temporary file
      fs.unlinkSync(tempPath);
    }
  },
};

module.exports = UserController;
