from app import app, db

# This script forces the database to delete and recreate itself
with app.app_context():
    print("1. Deleting old database tables...")
    db.drop_all()  # Wipes everything clean
    
    print("2. Creating new tables with 'is_banned' & 'last_login'...")
    db.create_all()  # Rebuilds based on your latest code
    
    print("✅ SUCCESS! Database is fixed. You can run app.py now.")