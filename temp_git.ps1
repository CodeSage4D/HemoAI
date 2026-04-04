git init
git branch -M main
git remote add origin git@github.com:CodeSage4D/HemoAI.git
git add .gitignore .gitattributes README.md
git commit -m "chore: initialize root configuration"
git add backend/
git commit -m "feat(backend): implement FastAPI core, PyJWT Authentication, and Scikit-Learn Stubs"
git add frontend/
git commit -m "feat(frontend): construct Next.js marketing hub, AI chatbot, and Dashboard GUI"
git push -u origin main
