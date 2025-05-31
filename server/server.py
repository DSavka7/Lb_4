from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
import bcrypt

app = Flask(__name__, static_folder="../docs", static_url_path="/")
CORS(app)  


USERS_FILE = 'users.json'


if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, 'w') as f:
        json.dump([], f)


@app.route('/')
def serve_index():
    return send_from_directory('../docs', 'index.html')

@app.route('/login')
def serve_login():
    return send_from_directory('../docs', 'login.html')

@app.route('/register')
def serve_register():
    return send_from_directory('../docs', 'register.html')


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

   
    if not email or not password:
        return jsonify({'message': 'Заповніть усі поля!'}), 400
    if len(password) < 8:
        return jsonify({'message': 'Пароль має містити щонайменше 8 символів!'}), 400


    with open(USERS_FILE, 'r') as f:
        users = json.load(f)

   
    if any(user['email'] == email for user in users):
        return jsonify({'message': 'Email вже зареєстровано!'}), 400

   
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    
    users.append({'email': email, 'password': hashed_password})
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f)

    return jsonify({'message': 'Реєстрація успішна! Увійдіть у свій акаунт.'}), 200


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

   
    if not email or not password:
        return jsonify({'message': 'Заповніть усі поля!'}), 400

   
    with open(USERS_FILE, 'r') as f:
        users = json.load(f)

   
    for user in users:
        if user['email'] == email and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return jsonify({'message': 'Вхід успішний!'}), 200

    return jsonify({'message': 'Невірний email або пароль!'}), 401


@app.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Сервер працює!'}), 200

if __name__ == '__main__':
    app.run(debug=True)