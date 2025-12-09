from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import os
import re
from datetime import datetime

# app = Flask(__name__)
# app.config['SECRET_KEY'] = 'sujal-secret-key-999' 

# # ABSOLUTE PATH FIX
# basedir = os.path.abspath(os.path.dirname(__file__))
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'users.db')
# app.config['UPLOAD_FOLDER'] = 'protected_notes'



app = Flask(__name__)
app.config['SECRET_KEY'] = 'sujal-secret-key-999' # In production, change this to a random string!

# --- DATABASE SETUP (Local vs Production) ---
database_url = os.environ.get('DATABASE_URL')

if database_url:
    # Fix for Render's Postgres URL format (postgres:// -> postgresql://)
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # We are on Laptop -> Use SQLite
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'users.db')

app.config['UPLOAD_FOLDER'] = 'protected_notes'


db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# DATABASE MODEL
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    allowed_notes = db.Column(db.String(500), default="") 
    pending_subject = db.Column(db.String(100), nullable=True) 
    transaction_id = db.Column(db.String(100), nullable=True)
    is_banned = db.Column(db.Boolean, default=False)
    last_login = db.Column(db.DateTime, default=datetime.utcnow) 

with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def is_strong_password(password):
    if len(password) < 8: return False, "Password must be at least 8 characters."
    if not re.search(r"\d", password): return False, "Password must contain a number."
    if not re.search(r"[a-zA-Z]", password): return False, "Password must contain a letter."
    return True, ""

def get_all_notes():
    notes_data = []
    base_path = app.config['UPLOAD_FOLDER']
    for sem in ['sem5', 'sem7']:
        folder_path = os.path.join(base_path, sem)
        if not os.path.exists(folder_path): os.makedirs(folder_path)
        for filename in os.listdir(folder_path):
            if filename.endswith('.pdf'):
                clean_title = filename.replace('_', ' ').replace('.pdf', '')
                subject_id = clean_title.split(' ')[0]
                notes_data.append({
                    'semester': sem, 'filename': filename, 'title': clean_title, 
                    'subject_id': subject_id, 'topic': f"{sem.upper()} Resource"
                })
    return notes_data

# --- ROUTES ---

@app.route('/')
def home():
    all_notes = get_all_notes()
    user_access_list = []
    if current_user.is_authenticated and current_user.allowed_notes:
        user_access_list = current_user.allowed_notes.split(',')
    return render_template('index.html', user=current_user, notes=all_notes, access_list=user_access_list)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        action = request.form.get('action')
        username = request.form.get('username')
        password = request.form.get('password')

        if action == 'register':
            if User.query.filter_by(username=username).first():
                flash('Username exists!', 'error')
            else:
                is_valid, msg = is_strong_password(password)
                if not is_valid: flash(msg, 'error')
                else:
                    hashed_pw = generate_password_hash(password)
                    new_user = User(username=username, password=hashed_pw)
                    db.session.add(new_user)
                    db.session.commit()
                    login_user(new_user)
                    flash('Account created!', 'success')
                    return redirect(url_for('home'))
        elif action == 'login':
            user = User.query.filter_by(username=username).first()
            if user and check_password_hash(user.password, password):
                if user.is_banned:
                    flash('🚫 Banned for fake payments.', 'error')
                    return redirect(url_for('login'))
                user.last_login = datetime.utcnow()
                db.session.commit()
                login_user(user)
                return redirect(url_for('home'))
            else:
                flash('Invalid credentials', 'error')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

# --- UPGRADE ROUTE (MANUAL VERIFICATION RESTORED) ---
@app.route('/upgrade', methods=['GET', 'POST'])
@login_required
def upgrade():
    selected = request.args.get('subject', '')
    
    MY_UPI_ID = "sujalvachhani@okhdfcbank" 
    MY_NAME = "Sujal Vachhani"

    if request.method == 'POST':
        utr = request.form.get('utr')
        subject = request.form.get('subject_code')
        
        # Check Length (Basic check, not instant unlock)
        if len(utr) < 5: 
            flash("Invalid UTR (Too short)", 'error')
        else:
            # SAVE FOR MANUAL APPROVAL
            current_user.transaction_id = utr
            current_user.pending_subject = subject
            db.session.commit()
            
            flash(f'Payment submitted! Please wait for Admin verification (approx 1 hr).', 'success')
            return redirect(url_for('home'))
            
    return render_template('payment.html', 
                           notes=get_all_notes(), 
                           selected=selected, 
                           upi_id=MY_UPI_ID, 
                           payee_name=MY_NAME)

@app.route('/view/<path:semester>/<path:filename>')
@login_required
def view_note(semester, filename):
    clean_title = filename.replace('_', ' ').replace('.pdf', '')
    subject_id = clean_title.split(' ')[0]
    allowed = False
    if current_user.allowed_notes and subject_id in current_user.allowed_notes.split(','):
        allowed = True     
    if not allowed:
        flash(f"🔒 Buy {subject_id} first.", "error")
        return redirect(url_for('upgrade', subject=subject_id))
    return render_template('viewer.html', semester=semester, filename=filename)

@app.route('/get_pdf/<path:semester>/<path:filename>')
@login_required
def get_pdf_file(semester, filename):
    clean_title = filename.replace('_', ' ').replace('.pdf', '')
    subject_id = clean_title.split(' ')[0]
    if not current_user.allowed_notes or subject_id not in current_user.allowed_notes.split(','):
         return "Access Denied", 403
    directory = os.path.join(app.config['UPLOAD_FOLDER'], semester)
    return send_from_directory(directory, filename)

@app.route('/api/check_status')
def check_status():
    if not current_user.is_authenticated: return jsonify({'status': 'not_logged_in'})
    return jsonify({'status': 'success', 'allowed': current_user.allowed_notes})

# --- ADMIN ROUTES ---
@app.route('/admin')
def admin():
    if request.args.get('secret') != 'sujal123': return "Access Denied"
    users = User.query.all()
    sales = sum([len(u.allowed_notes.split(',')) for u in users if u.allowed_notes])
    pending = sum([1 for u in users if u.pending_subject])
    total_users = len(users)
    return render_template('admin.html', users=users, revenue=sales*49, sales=sales, pending=pending, total_users=total_users)

@app.route('/approve/<int:user_id>')
def approve_user(user_id):
    if request.args.get('secret') != 'sujal123': return "Access Denied"
    user = User.query.get(user_id)
    if user.pending_subject:
        if user.allowed_notes: user.allowed_notes += "," + user.pending_subject
        else: user.allowed_notes = user.pending_subject
        user.pending_subject = None
        user.transaction_id = None
        db.session.commit()
    return redirect('/admin?secret=sujal123')

@app.route('/ban/<int:user_id>')
def ban_user(user_id):
    if request.args.get('secret') != 'sujal123': return "Access Denied"
    user = User.query.get(user_id)
    user.is_banned = True
    user.allowed_notes = ""
    db.session.commit()
    return redirect('/admin?secret=sujal123')

if __name__ == '__main__':
    app.run(debug=True)