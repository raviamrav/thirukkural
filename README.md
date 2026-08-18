# Thirukkural Web App 📚
## https://raviamrav-thirukkural.web.app/

An interactive, bilingual web application serving the complete collection of 1,330 Thirukkural chapters. It supports switching translations dynamically between English (EN) and German (DE).

## 👤 User Guide
* **Read:** Browse the complete Thirukkural on any screen size.
* **Navigate:** Jump quickly to chapters using the dropdown menus or Table of Contents (TOC).
* **Toggle Languages:** Instantly swap translations between English and German in the toolbar.

## 🛠️ Developer Guide

### 1. Execute Locally (Generate the Book)
The website is dynamically generated from raw data and assets. To build the project locally, run:
```bash
npm run generate:book
```
This script compiles the files and automatically writes index.html and book_app.js directly into the /public folder.

2. Local Testing and Debugging

To test and preview your local changes exactly as they would behave in production, start the Firebase emulator:
```
firebase emulators:start --only hosting
```
Open your browser and visit: http://localhost:5000

To Debug: Press F12 to open Developer Tools and check the Console tab for any script errors or path issues.

🚀 Deployment (How it works with GitHub & Firebase)

We use GitHub Actions for automated deployments. You never need to run firebase deploy manually.

The Automated Pipeline:
```
1. When you push to the main branch, GitHub triggers a runner.

2. The runner downloads your source code and executes the build script (npm run generate:book).

3. The generator outputs the compilation files directly into the virtual public/ directory.

4. The GitHub Action safely pushes the contents of /public live to Firebase Hosting.
```
To Deploy Your Changes:

Simply commit your code edits and push them to your repository:
```
git add .
git commit -m "Update book content"
git push origin main
```
You can monitor your live build on GitHub by visiting the Actions tab of your repository!
