# 🚀 Git Quick Cheat Sheet

## Daily Commands

```bash
# 1. Check what changed
git status

# 2. See code changes
git diff

# 3. Add your changes
git add .

# 4. Commit with message
git commit -m "What you changed"

# 5. Push to GitHub
git push
```

---

## Most Used Commands

| Need | Command |
|------|---------|
| See changes | `git status` |
| See code diff | `git diff` |
| Stage changes | `git add .` |
| Commit | `git commit -m "msg"` |
| Push | `git push` |
| Pull | `git pull` |
| See history | `git log --oneline` |
| Undo file | `git restore filename` |
| Undo changes | `git reset --hard` |

---

## First Time Setup

```bash
# 1. Go to your folder
cd d:\PRACTICE_JAVA\JS-WITH-GEMINI\TaskFlow

# 2. Create on GitHub.com (copy the URL)

# 3. Add remote
git remote add origin https://github.com/USERNAME/REPO.git

# 4. Push
git branch -M main
git push -u origin main
```

---

## Check Changes

```bash
# See file status
git status

# See code changes (before commit)
git diff

# See changes staged (ready to commit)
git diff --cached

# See all commits
git log --oneline

# See specific commit
git show COMMIT_ID
```

---

## Workflow

```bash
# Make changes to files...

# 1. Check status
git status              # See what changed

# 2. See the diff
git diff                # See code changes

# 3. Stage changes
git add .               # Add all
# OR
git add filename.txt    # Add specific file

# 4. Commit
git commit -m "Clear message about what changed"

# 5. Push
git push
```

---

## Fix Mistakes

```bash
# Undo file before commit
git restore filename

# Unstage file (remove from staging)
git reset filename

# See what you committed
git show HEAD

# Undo last commit (keeping changes)
git reset --soft HEAD~1

# Undo last commit (throwing away changes)
git reset --hard HEAD~1
```

---

## GitHub Workflow

```bash
# Get latest from GitHub
git pull

# Your changes...

# Push to GitHub
git add .
git commit -m "message"
git push
```

---

## Check Remote

```bash
# See remote URLs
git remote -v

# Add remote
git remote add origin https://github.com/user/repo.git

# Remove remote
git remote remove origin

# Change remote
git remote set-url origin https://github.com/user/newrepo.git
```

---

## Useful Tips

- **Commit often** (not once a day, but per feature)
- **Good messages** ("Add search feature" not "asdf")
- **Check `git status` first** always
- **`git diff` before commit** to verify changes
- **`git log --oneline`** to see what was done

---

## Remember

```bash
status → diff → add → commit → push
```

That's the flow! Use `git status` anytime to see where you are.
