import sys
import os

# Add root directory to python path so server.py can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from server import app, init_db

try:
    init_db()
except Exception:
    pass

# Export WSGI application object for Vercel Python runtime
app = app
