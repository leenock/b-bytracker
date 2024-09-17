import os

from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import pytz
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:feature_2024@localhost/baby-tracker'
db = SQLAlchemy(app)
CORS(app)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, nullable=False)
  #  created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(pytz.timezone('Africa/Nairobi')))


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
@app.route('/events', methods=['POST'])
def create_event():
    description = request.json['description']
    event = Event(description)
    db.session.add(event)
    db.session.commit()
    return format_event(event)

# get all the events
@app.route('/events', methods=['GET'])
def get_events():
    events= Event.query.order_by(Event.created_at.asc()).all()
    event_list = []
    for event in events:
        event_list.append(format_event(event))
    return {'events': event_list}

# get single event
@app.route('/events/<id>', methods=['GET'])
def get_event(id):
    event = Event.query.filter_by(id=id).one()
    formatted_event = format_event(event)
    return {'event': formatted_event}

# Delete an event
@app.route('/events/<id>', methods=['DELETE'])
def delete_event(id):
    event = Event.query.filter_by(id=id).one()
    db.session.delete(event)
    db.session.commit()
    return f'Event (id: {id}) deleted'

# update an Event
@app.route('/events/<id>', methods=['PUT'])
def update_event(id):
    event = Event.query.filter_by(id=id)
    description = request.json['description']
    event.update(dict(description = description, created_at = datetime.utcnow()))
    db.session.commit()
    return {'event': format_event(event.one())}

if __name__ == '__main__':
    app.run(debug=True)
