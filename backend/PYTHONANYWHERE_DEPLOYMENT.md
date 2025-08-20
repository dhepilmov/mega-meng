# PythonAnywhere Deployment Instructions

## Step 1: Create Account
- Go to https://www.pythonanywhere.com/
- Sign up for "Beginner" (free) account
- No credit card required

## Step 2: Upload Files
1. Login to PythonAnywhere dashboard
2. Go to "Files" tab
3. Create folder: `/home/yourusername/mysite/`
4. Upload these files:
   - pythonanywhere_server.py (rename to main.py)
   - pythonanywhere_requirements.txt (rename to requirements.txt)

## Step 3: Install Dependencies
1. Go to "Consoles" tab
2. Open "Bash" console
3. Run: `pip3.11 install --user -r /home/yourusername/mysite/requirements.txt`

## Step 4: Create Web App
1. Go to "Web" tab
2. Click "Add a new web app"
3. Choose "Manual configuration" → "Python 3.11"
4. Set source code path: `/home/yourusername/mysite/`

## Step 5: Configure WSGI
1. In Web tab, click on WSGI configuration file
2. Replace content with:
```python
import sys
import os

path = '/home/yourusername/mysite'
if path not in sys.path:
    sys.path.append(path)

from main import app as application
```

## Step 6: Your API URL
Your API will be available at:
- https://yourusername.pythonanywhere.com/api/
- https://yourusername.pythonanywhere.com/api/health

## Note: 
Free plan doesn't include MongoDB, so this uses in-memory storage for demo.
You can upgrade later to add database support.