from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from supabase import create_client
import os

app = Flask(__name__)

# =====================================================
# CONFIG
# =====================================================
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-secret")

# =====================================================
# SUPABASE (LAZY INITIALIZATION — VERY IMPORTANT)
# =====================================================
def get_supabase():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")

    if not url or not key:
        raise RuntimeError("Supabase environment variables are missing")

    return create_client(url, key)

# =====================================================
# AUTH HELPERS
# =====================================================
def login_required():
    return "user_id" in session

# =====================================================
# AUTH ROUTES
# =====================================================
@app.route("/", methods=["GET", "POST"])
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        supabase = get_supabase()

        email = request.form["email"]
        password = request.form["password"]

        res = supabase.table("users").select("*").eq("email", email).execute()

        if not res.data:
            flash("Invalid email or password", "error")
            return redirect(url_for("login"))

        user = res.data[0]

        if user["password"] != password:
            flash("Invalid email or password", "error")
            return redirect(url_for("login"))

        session["user_id"] = user["id"]
        session["username"] = user["username"]

        return redirect(url_for("dashboard"))

    return render_template("login.html", register=False)

@app.route("/register", methods=["POST"])
def register():
    supabase = get_supabase()

    username = request.form["username"]
    email = request.form["email"]
    password = request.form["password"]

    existing = supabase.table("users").select("id").eq("email", email).execute()
    if existing.data:
        flash("Email already registered", "error")
        return redirect(url_for("login"))

    supabase.table("users").insert({
        "username": username,
        "email": email,
        "password": password
    }).execute()

    flash("Account created successfully. Please login.", "success")
    return redirect(url_for("login"))

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))

# =====================================================
# DASHBOARD
# =====================================================
@app.route("/dashboard")
def dashboard():
    if not login_required():
        return redirect(url_for("login"))

    supabase = get_supabase()
    user_id = session["user_id"]

    tx = supabase.table("transactions").select("*").eq("user_id", user_id).execute().data or []

    income = sum(t["amount"] for t in tx if t["type"] == "income")
    expenses = sum(t["amount"] for t in tx if t["type"] == "expense")
    balance = income - expenses
    savings = income * 0.2

    recent = sorted(tx, key=lambda x: x["date"], reverse=True)[:5]

    return render_template(
        "dashboard.html",
        username=session["username"],
        income=income,
        expenses=expenses,
        balance=balance,
        savings=savings,
        recent=recent
    )

# =====================================================
# ADD TRANSACTION
# =====================================================
@app.route("/add", methods=["GET", "POST"])
def add_transaction():
    if not login_required():
        return redirect(url_for("login"))

    if request.method == "POST":
        supabase = get_supabase()

        supabase.table("transactions").insert({
            "user_id": session["user_id"],
            "amount": float(request.form["amount"]),
            "type": request.form["type"],
            "category": request.form["category"],
            "description": request.form.get("description"),
            "date": request.form["date"]
        }).execute()

        flash("Transaction added successfully", "success")
        return redirect(url_for("dashboard"))

    return render_template("add_transaction.html")

# =====================================================
# HISTORY
# =====================================================
@app.route("/history")
def history():
    if not login_required():
        return redirect(url_for("login"))

    supabase = get_supabase()
    filter_type = request.args.get("filter", "all")

    query = supabase.table("transactions").select("*").eq("user_id", session["user_id"])

    if filter_type in ["income", "expense"]:
        query = query.eq("type", filter_type)

    transactions = query.execute().data or []

    return render_template(
        "history.html",
        transactions=transactions,
        filter=filter_type
    )

# =====================================================
# ANALYTICS
# =====================================================
@app.route("/analytics")
def analytics():
    if not login_required():
        return redirect(url_for("login"))

    supabase = get_supabase()
    tx = supabase.table("transactions").select("*").eq("user_id", session["user_id"]).execute().data or []

    categories = {}
    monthly = {}

    for t in tx:
        if t["type"] == "expense":
            categories[t["category"]] = categories.get(t["category"], 0) + t["amount"]

        month = str(t["date"])[:7]
        monthly.setdefault(month, {"income": 0, "expense": 0})
        monthly[month][t["type"]] += t["amount"]

    category_list = [{"category": k, "total": v} for k, v in categories.items()]
    monthly_list = [{"month": k, **v} for k, v in sorted(monthly.items())]

    return render_template(
        "analytics.html",
        categories=category_list,
        monthly=monthly_list
    )

# =====================================================
# API
# =====================================================
@app.route("/api/delete-transaction/<id>", methods=["DELETE"])
def delete_transaction(id):
    if not login_required():
        return jsonify({"error": "Unauthorized"}), 401

    supabase = get_supabase()
    supabase.table("transactions").delete().eq("id", id).execute()

    return jsonify({"success": True})
