import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, getMyDetails, logoutUser } from '../services/authService';
import { getMyBookings, getMyEvents } from '../services/eventService';

function MyProfile() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('details');

  const [details, setDetails] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const [detailsData, bookingsData, eventsData] = await Promise.all([
          getMyDetails(),
          getMyBookings(),
          getMyEvents()
        ]);

        setDetails(detailsData);
        setBookings(bookingsData || []);
        setEvents(eventsData || []);
      } catch (err) {
        const message = err.message || '';

        if (
          message.toLowerCase().includes('401') ||
          message.toLowerCase().includes('jwt') ||
          message.toLowerCase().includes('token') ||
          message.toLowerCase().includes('unauthorized')
        ) {
          logoutUser();
          navigate('/login');
          return;
        }

        setError(message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="page-container center-text">
        <h2>Loading profile...</h2>
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
      <h1 className="page-title">My Profile</h1>

      <div className="tab-row">
        <button
          onClick={() => setActiveTab('details')}
          className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
          type="button"
        >
          My Details
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
          type="button"
        >
          My Bookings
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
          type="button"
        >
          My Events
        </button>
      </div>

      {activeTab === 'details' && (
        <div className="card centered-card">
          <h2 className="section-title">My Details</h2>

          {details ? (
            <div className="info-grid center-text">
              <p>
                <strong>Name:</strong> {details.name}
              </p>
              <p>
                <strong>Email:</strong> {details.email}
              </p>
              <p>
                <strong>Role:</strong> {details.role}
              </p>
            </div>
          ) : (
            <p className="empty-state">No details found.</p>
          )}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="section-block">
          <h2 className="section-title">My Bookings</h2>

          {bookings.length === 0 ? (
            <p className="empty-state">No bookings found.</p>
          ) : (
            <div className="list-stack">
              {bookings.map((booking) => (
                <div key={booking.id} className="compact-card center-text">
                  <div className="info-grid">
                    <p>
                      <strong>Event Name:</strong> {booking.eventTitle}
                    </p>
                    <p>
                      <strong>Date & Time:</strong> {new Date(booking.eventDate).toLocaleString()}
                    </p>
                    <p>
                      <strong>Venue Name:</strong> {booking.venueName}
                    </p>
                    <p>
                      <strong>Venue Location:</strong> {booking.venueLocation}
                    </p>
                    <p>
                      <strong>Tickets Booked:</strong> {booking.tickets}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'events' && (
        <div className="section-block">
          <h2 className="section-title">My Events</h2>

          {events.length === 0 ? (
            <p className="empty-state">No events created yet.</p>
          ) : (
            <div className="list-stack">
              {events.map((event) => (
                <div key={event.id} className="card center-text">
                  <div className="info-grid">
                    <p>
                      <strong>Title:</strong> {event.title}
                    </p>
                    <p>
                      <strong>Description:</strong> {event.description}
                    </p>
                    <p>
                      <strong>Date:</strong> {new Date(event.date).toLocaleString()}
                    </p>
                    <p>
                      <strong>Status:</strong> {event.status}
                    </p>
                  </div>

                  <div className="inline-action-row">
                    <button
                      onClick={() => navigate(`/my-event/${event.id}`)}
                      className="secondary-button"
                      type="button"
                    >
                      View Event Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyProfile;