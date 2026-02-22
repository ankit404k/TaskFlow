# 📘 GitHub & Git Guide for TaskFlow

## ✅ What's Done Locally

Your project is **already initialized with git**:
- ✅ Git repository created
- ✅ All files added & committed
- ✅ `.gitignore` file created (ignores unnecessary files)
- ✅ Initial commit: `00a1f34`

---

## 🚀 How to Push to GitHub (Step-by-Step)

### Step 1: Go to GitHub.com

1. **Login** to your GitHub account
2. Click **"+"** icon (top right)
3. Select **"New repository"**

### Step 2: Create Repository

**Fill in these details:**

| Field | Value |
|-------|-------|
| Repository name | `TaskFlow` or `taskflow-kanban` |
| Description | Professional Kanban Board with Drag & Drop |
| Visibility | **Public** (everyone can see) |
| Initialize repo | ❌ NO (we already have files) |

4. Click **"Create repository"**

### Step 3: Copy Your Repository URL

After clicking "Create", you'll see a page with commands.

**You need this URL:** `https://github.com/YOUR_USERNAME/TaskFlow.git`

Copy this URL - you'll need it in the next step!

### Step 4: Push from Command Line

Open PowerShell/Terminal and run:

```bash
cd d:\PRACTICE_JAVA\JS-WITH-GEMINI\TaskFlow

# Add remote (replace YOUR_URL with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/TaskFlow.git

# Verify it's added
git remote -v

# Rename branch to 'main' (modern standard)
git branch -M main

# Push your code to GitHub!
git push -u origin main
```

✅ **Done!** Your project is now on GitHub!

---

## 🔍 How to Check What Changed

### **See Current Status** (most important)
```bash
git status
```
Shows:
- Files you modified
- New files you added
- Files ready to commit

### **See Code Changes** (detailed comparison)
```bash
# See all changes
git diff

# See changes in one file
git diff filename.html

# See changes ready to commit
git diff --cached
```

### **See Commit History**
```bash
# See all commits
git log

# See compact view
git log --oneline

# See last 5 commits
git log -5

# See who changed what
git log -p
```

### **See Differences Between Commits**
```bash
# Compare current work with last commit
git diff HEAD

# Compare two commits
git diff COMMIT1 COMMIT2

# See which files changed in a commit
git show COMMIT_ID --name-only
```

---

## 💾 Workflow: After Making Changes

This is what you'll do every time you change code:

### Step 1: Check what changed
```bash
git status
```

### Step 2: See the exact changes
```bash
git diff
```

### Step 3: Add your changes
```bash
git add .
```

### Step 4: Commit with a message
```bash
git commit -m "Added feature: Search functionality"
```

### Step 5: Push to GitHub
```bash
git push
```

---

## 📋 Common Git Commands

### **Status & History**
| Command | Purpose |
|---------|---------|
| `git status` | See what files changed |
| `git diff` | See code changes in detail |
| `git log` | See all commits |
| `git log --oneline` | See commits (compact) |
| `git show COMMIT_ID` | Show specific commit details |

### **Making Changes**
| Command | Purpose |
|---------|---------|
| `git add .` | Stage all changes |
| `git add filename` | Stage specific file |
| `git commit -m "message"` | Create checkpoint |
| `git push` | Send to GitHub |
| `git pull` | Get latest from GitHub |

### **Undo Changes**
| Command | Purpose |
|---------|---------|
| `git restore filename` | Undo changes to file |
| `git reset filename` | Unstage file |
| `git revert COMMIT_ID` | Undo a commit |

### **Branches**
| Command | Purpose |
|---------|---------|
| `git branch` | See all branches |
| `git branch new-feature` | Create new branch |
| `git checkout new-feature` | Switch to branch |
| `git merge new-feature` | Merge branch into main |

---

## 🎯 Best Practices

### **Good Commit Messages**
✅ **Good:**
```
Added dark mode toggle
Fixed drag and drop bug on mobile
Improved search performance
Updated README with setup instructions
```

❌ **Bad:**
```
fixed stuff
changes
update
asdf
```

### **Commit Often**
- Make small, focused commits
- One feature per commit
- Makes history easy to understand
- Easy to undo if needed

### **Before Pushing**
Always check changes:
```bash
git status
git diff
```

---

## 🔐 Authentication

### **First Time Setup** (to avoid entering password)

#### Option 1: Personal Access Token (Recommended)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@gmail.com"
```

Generate token on GitHub:
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (with `repo` scope)
3. Copy the token
4. When git asks for password, **paste the token**

#### Option 2: SSH (Advanced)
```bash
ssh-keygen -t ed25519 -C "your.email@gmail.com"
# Add public key to GitHub settings
```

---

## 📊 Your Current Repository Status

**Repository:** TaskFlow  
**Branch:** main  
**Commits:** 1  
**Files:** 5

### Tracked Files:
```
.gitignore
taskflow-kanban/README.md
taskflow-kanban/index.html
taskflow-kanban/script.js
taskflow-kanban/style.css
```

---

## 🚀 Final Checklist

Before pushing to GitHub:

- [ ] Have GitHub account
- [ ] Created repository on GitHub (got the URL)
- [ ] Run: `git remote add origin YOUR_URL`
- [ ] Run: `git branch -M main`
- [ ] Run: `git push -u origin main`
- [ ] Check GitHub to confirm files are there

---

## ❓ Quick Help

**Q: How do I see what files changed?**  
A: `git status` or `git diff`

**Q: How do I undo a change?**  
A: `git restore filename` (before commit) or `git revert COMMIT_ID` (after commit)

**Q: How do I update my local code with GitHub changes?**  
A: `git pull`

**Q: How do I see who changed what?**  
A: `git log -p` or browse on GitHub

**Q: How often should I commit?**  
A: As often as you make meaningful changes (multiple times per day is normal)

---

## 📚 More Resources

- **GitHub Docs:** https://docs.github.com
- **Git Cheatsheet:** https://git-scm.com/book
- **Interactive Tutorial:** https://learngitbranching.js.org

---

**Your TaskFlow project is ready! Push it to GitHub and share with the world! 🚀**
