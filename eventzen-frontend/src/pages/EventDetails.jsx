import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicEventDetails, bookEvent } from '../services/eventService';
import { isLoggedIn } from '../services/authService';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tickets, setTickets] = useState(1);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const data = await getPublicEventDetails(id);
        setDetails(data);
      } catch (err) {
        setError(err.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleBooking = async () => {
    setBookingMessage('');

    if (!tickets || Number(tickets) < 1) {
      setBookingMessage('Please enter at least 1 ticket');
      return;
    }

    try {
      setBookingLoading(true);

      const data = await bookEvent({
        eventId: Number(id),
        tickets: Number(tickets)
      });

      setBookingMessage(data?.message || 'Booking successful');

      const refreshed = await getPublicEventDetails(id);
      setDetails(refreshed);
    } catch (err) {
      setBookingMessage(err.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container center-text">
        <h2>Loading event details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container center-text">
        <h2>{error}</h2>
        <div className="inline-action-row">
          <button onClick={() => navigate('/')} className="secondary-button" type="button">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { event, venue, totalTickets, availableSeats } = details;

  return (
    <div className="page-container">
      <div className="back-button-wrap">
        <button onClick={() => navigate('/')} className="ghost-button" type="button">
          Back to Home
        </button>
      </div>

      <h1 className="page-title">{event.title}</h1>

      <div className="card center-text">
        <div className="info-grid">
          <p>
            <strong>Description:</strong> {event.description}
          </p>
          <p>
            <strong>Date:</strong> {new Date(event.date).toLocaleString()}
          </p>
          <p>
            <strong>Venue Name:</strong> {venue ? venue.name : 'Not available'}
          </p>
          <p>
            <strong>Venue Location:</strong> {venue ? venue.location : 'Not available'}
          </p>
        </div>
      </div>

      <hr className="divider" />

      <div className="section-block">
        <h2 className="section-title">Booking Summary</h2>

        <div className="card center-text">
          <div className="info-grid">
            <p>
              <strong>Total Tickets Booked:</strong> {totalTickets}
            </p>
            <p>
              <strong>Available Seats:</strong> {availableSeats}
            </p>
          </div>
        </div>
      </div>

      <hr className="divider" />

      <div className="section-block">
        <h2 className="section-title">Book This Event</h2>

        {!isLoggedIn() ? (
          <div className="card centered-card center-text">
            <p style={{ marginBottom: '12px' }}>You must login first to book this event.</p>
            <div className="form-actions">
              <button onClick={() => navigate('/login')} className="secondary-button" type="button">
                Go to Login
              </button>
            </div>
          </div>
        ) : (
          <div className="card centered-card center-text">
            <div className="form-group">
              <label className="form-label center-text">Number of Tickets</label>
              <input
                type="number"
                min="1"
                value={tickets}
                onChange={(e) => setTickets(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="form-actions">
              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="secondary-button"
                type="button"
              >
                {bookingLoading ? 'Booking...' : 'Book Now'}
              </button>
            </div>

            {bookingMessage && (
              <p
                className={
                  bookingMessage.toLowerCase().includes('success')
                    ? 'message-success'
                    : 'message-error'
                }
                style={{ marginTop: '12px' }}
              >
                {bookingMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetails;