import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublicEvents } from '../services/eventService';

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getPublicEvents();
        setEvents(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="page-container center-text">
        <h2>Loading events...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container center-text">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">EventZen Home Page</h1>

      {events.length === 0 ? (
        <p className="empty-state">No approved events available right now.</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => {
            const eventDate = new Date(event.date);

            return (
              <div key={event.id} className="card center-text">
                <h3 className="event-card-title">{event.title}</h3>

                <p className="event-card-description">{event.description}</p>

                <div className="meta-stack">
                  <p>
                    <strong>Date:</strong> {eventDate.toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong>{' '}
                    {eventDate.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="inline-action-row">
                  <button
                    onClick={() => navigate(`/event/${event.id}`)}
                    className="secondary-button"
                    type="button"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Home;