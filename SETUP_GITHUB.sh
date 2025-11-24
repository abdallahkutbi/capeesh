#!/bin/bash

# GitHub Setup Script for Capeesh Project
# Run this after creating a GitHub repository

echo "GitHub Repository Setup"
echo "======================"
echo ""
echo "Please provide your GitHub repository URL:"
echo "Example: https://github.com/username/capeesh.git"
echo ""
read -p "GitHub URL: " GITHUB_URL

if [ -z "$GITHUB_URL" ]; then
    echo "Error: GitHub URL is required"
    exit 1
fi

# Add remote
git remote add origin "$GITHUB_URL" 2>/dev/null || git remote set-url origin "$GITHUB_URL"

# Rename branch to main
git branch -M main

# Push to GitHub
echo ""
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo "Repository: $GITHUB_URL"

