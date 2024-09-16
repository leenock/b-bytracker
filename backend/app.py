from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:feature_2024@localhost/baby-tracker'
db = SQLAlchemy(app)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"Event: {self.description}"

    def __init__(self, description):
        self.description = description

        # Utility function to format event objects
def format_event(event):
    return {
        'id': event.id,
        'description': event.description,
        'created_at': event.created_at.isoformat()
    }

# Define a route for the root URL
@app.route('/')
def home():
    return 'Hello, Flask!'

# Define a route for creating an event
@app.route('/event', methods=['POST'])
def create_event():
    description = request.json['description']
    event = Event(description)
    db.session.add(event)
    db.session.commit()
    return format_event(event)

if __name__ == '__main__':
    app.run(debug=True)
