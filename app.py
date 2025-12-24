from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
from datetime import datetime
from functools import wraps

app = Flask(__name__)
app.secret_key = 'trackify_secret_key_2024'

# Database setup
def get_db():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
    conn.execute('''CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )''')
    conn.commit()
    conn.close()

init_db()

# Login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        conn = get_db()
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        conn.close()
        
        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['username'] = user['username']
            return redirect(url_for('dashboard'))
        flash('Invalid email or password', 'error')
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        
        conn = get_db()
        try:
            conn.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                        (username, email, generate_password_hash(password)))
            conn.commit()
            flash('Registration successful! Please login.', 'success')
            return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            flash('Username or email already exists', 'error')
        finally:
            conn.close()
    return render_template('login.html', register=True)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    conn = get_db()
    
    # Get totals
    income = conn.execute('''SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
                            WHERE user_id = ? AND type = 'income' ''', (session['user_id'],)).fetchone()['total']
    expenses = conn.execute('''SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
                              WHERE user_id = ? AND type = 'expense' ''', (session['user_id'],)).fetchone()['total']
    
    # Recent transactions
    recent = conn.execute('''SELECT * FROM transactions WHERE user_id = ? 
                            ORDER BY date DESC LIMIT 5''', (session['user_id'],)).fetchall()
    conn.close()
    
    balance = income - expenses
    savings = balance * 0.2 if balance > 0 else 0
    
    return render_template('dashboard.html', 
                          balance=balance, 
                          income=income, 
                          expenses=expenses, 
                          savings=savings,
                          recent=recent,
                          username=session['username'])

@app.route('/add-transaction', methods=['GET', 'POST'])
@login_required
def add_transaction():
    if request.method == 'POST':
        amount = float(request.form['amount'])
        trans_type = request.form['type']
        category = request.form['category']
        description = request.form.get('description', '')
        date = request.form['date']
        
        conn = get_db()
        conn.execute('''INSERT INTO transactions (user_id, amount, type, category, description, date)
                       VALUES (?, ?, ?, ?, ?, ?)''',
                    (session['user_id'], amount, trans_type, category, description, date))
        conn.commit()
        conn.close()
        
        flash('Transaction added successfully!', 'success')
        return redirect(url_for('dashboard'))
    
    return render_template('add_transaction.html')

@app.route('/history')
@login_required
def history():
    filter_type = request.args.get('filter', 'all')
    
    conn = get_db()
    if filter_type == 'all':
        transactions = conn.execute('''SELECT * FROM transactions WHERE user_id = ? 
                                      ORDER BY date DESC''', (session['user_id'],)).fetchall()
    else:
        transactions = conn.execute('''SELECT * FROM transactions WHERE user_id = ? AND type = ?
                                      ORDER BY date DESC''', (session['user_id'], filter_type)).fetchall()
    conn.close()
    
    return render_template('history.html', transactions=transactions, filter=filter_type)

@app.route('/analytics')
@login_required
def analytics():
    conn = get_db()
    
    # Category breakdown
    categories = conn.execute('''SELECT category, SUM(amount) as total FROM transactions 
                                WHERE user_id = ? AND type = 'expense' 
                                GROUP BY category''', (session['user_id'],)).fetchall()
    
    # Monthly data
    monthly = conn.execute('''SELECT strftime('%Y-%m', date) as month, 
                             SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
                             SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
                             FROM transactions WHERE user_id = ?
                             GROUP BY month ORDER BY month DESC LIMIT 6''', (session['user_id'],)).fetchall()
    conn.close()
    
    return render_template('analytics.html', categories=categories, monthly=monthly)

@app.route('/api/delete-transaction/<int:id>', methods=['DELETE'])
@login_required
def delete_transaction(id):
    conn = get_db()
    conn.execute('DELETE FROM transactions WHERE id = ? AND user_id = ?', (id, session['user_id']))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)
