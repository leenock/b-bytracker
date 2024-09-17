import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import "./App.css";

const baseUrl = "http://127.0.0.1:5000";

function App() {
  const [description, setDescription] = useState("");
  const [Editdescription, setEditDescription] = useState("");
  const [eventsList, setEventsList] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const fetchEvents = async () => {
    try {
      const data = await axios.get(`${baseUrl}/events`);
      const { events } = data.data;
      setEventsList(events);
    } catch (err) {
      console.error("Error fetching events:", err.message);
    }
  };

  const handleChange = (e, field) => {
    if (field === "edit") {
      setEditDescription(e.target.value);
    } else {
      setDescription(e.target.value);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedEventId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/events/${selectedEventId}`);
      setEventsList(eventsList.filter((event) => event.id !== selectedEventId));
    } catch (err) {
      console.error("Error deleting event:", err.message);
    }
    setShowConfirmModal(false);
    setSelectedEventId(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setSelectedEventId(null);
  };

  const toggleEdit = (event) => {
    setEventId(event.id);
    setEditDescription(event.description);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (Editdescription) {
        const data = await axios.put(`${baseUrl}/events/${eventId}`, {
          description: Editdescription,
        });
        const updatedEvent = data.data.event;
        setEventsList(eventsList.map((event) => event.id === eventId ? updatedEvent : event));
      } else {
        const data = await axios.post(`${baseUrl}/events`, { description });
        setEventsList([...eventsList, data.data]);
      }
      setDescription("");
      setEditDescription("");
      setEventId(null);
    } catch (err) {
      console.error("Error submitting event:", err.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="App">
      {/* Header */}
      <header>
        <h1>Baby Tracker Event Manager</h1>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h2>Keep Track of Your Baby's Special Moments</h2>
          <p style={{ color: "green", fontFamily: "sans-serif", fontSize: "19px" }}>
            Capture every smile, every step, and every laugh with our
            easy-to-use baby event tracker. Whether it's their first words or
            their first birthday, effortlessly log each milestone to create a
            beautiful, personalized memory lane. Add, edit, and revisit these
            moments anytime, ensuring you never miss a single heartbeat of their
            journey.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1546015720-b8b30df5aa27?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Baby tracking illustration"
        />
      </section>

      {/* Event Form */}
      <section>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="description">Description of the Event</label>
            <input
              onChange={(e) => handleChange(e, "description")}
              type="text"
              name="description"
              id="description"
              placeholder="Describe the Event"
              value={description}
            />
            <button type="submit" className="success-button">
              Submit
            </button>
          </div>
        </form>
      </section>

      {/* Event List */}
      <section>
        <div className="events-list">
          {eventsList.map((event) => {
            if (eventId === event.id) {
              return (
                <form onSubmit={handleSubmit} key={event.id}>
                  <input
                    onChange={(e) => handleChange(e, "edit")}
                    type="text"
                    name="Editdescription"
                    id="Editdescription"
                    value={Editdescription}
                  />
                  <button type="submit">Submit</button>
                </form>
              );
            } else {
              return (
                <div className="event-card" key={event.id}>
                  <div className="event-card-header">
                    {format(new Date(event.created_at), "MM/dd, p")}
                  </div>
                  <div className="event-card-body">{event.description}</div>
                  <div className="event-card-footer">
                    <button onClick={() => toggleEdit(event)}>Edit</button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(event.id)}
                    >
                      X
                    </button>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </section>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Are you sure?</h2>
            <p>Do you really want to delete this event? This action cannot be undone.</p>
            <button onClick={handleConfirmDelete} className="confirm-button">
              Yes, Delete
            </button>
            <button onClick={handleCancelDelete} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
