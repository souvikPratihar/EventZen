import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { isLoggedIn, logoutUser } from '../services/authService';
import { getCustomerEventDetails } from '../services/eventService';
import { useToast } from '../hooks/useToast';

function MyEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    const fetchDetails = async () => {
      try {
        const data = await getCustomerEventDetails(id);
        setDetails(data);
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

        showToast(message || 'Failed to load event details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, navigate, showToast]);

  if (loading) {
    return (
      <div className="page-container center-text">
        <h2>Loading event details...</h2>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="page-container center-text">
        <h2>Event details could not be loaded.</h2>
        <div className="inline-action-row">
          <button onClick={() => navigate('/profile')} className="secondary-button" type="button">
            Back to My Profile
          </button>
        </div>
      </div>
    );
  }

  const { event, venue, vendors, totalBookings, totalTickets, availableSeats } = details;

  return (
    <div className="page-container">
      <div className="back-button-wrap">
        <button onClick={() => navigate('/profile')} className="ghost-button" type="button">
          Back to My Profile
        </button>
      </div>

      <h1 className="page-title">{event.title}</h1>

      <div className="card center-text">
        <div className="info-grid">
          <p>
            <strong>Description:</strong> {event.description}
          </p>
          <p>
            <strong>Date & Time:</strong> {new Date(event.date).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {event.status}
          </p>
          <p>
            <strong>Total Budget:</strong> {event.totalBudget}
          </p>
        </div>
      </div>

      <hr className="divider" />

      <div className="section-block">
        <h2 className="section-title">Venue Details</h2>

        {venue ? (
          <div className="card center-text">
            <div className="info-grid">
              <p>
                <strong>Name:</strong> {venue.name}
              </p>
              <p>
                <strong>Location:</strong> {venue.location}
              </p>
              <p>
                <strong>Capacity:</strong> {venue.capacity}
              </p>
              <p>
                <strong>Price:</strong> {venue.price}
              </p>
              <p>
                <strong>Phone:</strong> {venue.phoneNumber}
              </p>
            </div>
          </div>
        ) : (
          <p className="empty-state">Venue details not found.</p>
        )}
      </div>

      <hr className="divider" />

      <div className="section-block">
        <h2 className="section-title">Vendor Details</h2>

        {vendors && vendors.length > 0 ? (
          <div className="list-stack">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="compact-card center-text">
                <div className="info-grid">
                  <p>
                    <strong>Name:</strong> {vendor.name}
                  </p>
                  <p>
                    <strong>Type:</strong> {vendor.type}
                  </p>
                  <p>
                    <strong>Price:</strong> {vendor.price}
                  </p>
                  <p>
                    <strong>Phone:</strong> {vendor.phoneNumber}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No vendors found.</p>
        )}
      </div>

      <hr className="divider" />

      <div className="section-block">
        <h2 className="section-title">Booking Summary</h2>

        <div className="card center-text">
          <div className="info-grid">
            <p>
              <strong>Total Bookings:</strong> {totalBookings}
            </p>
            <p>
              <strong>Total Tickets:</strong> {totalTickets}
            </p>
            <p>
              <strong>Available Seats:</strong> {availableSeats}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyEventDetails;