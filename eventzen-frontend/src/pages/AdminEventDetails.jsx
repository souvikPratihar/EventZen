import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { isLoggedIn, getUserRole, logoutUser } from '../services/authService';
import { useToast } from '../hooks/useToast';
import { getAdminEventDetails, completeEvent, rejectEvent } from '../services/eventService';

function AdminEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDetails = async () => {
    try {
      const data = await getAdminEventDetails(id);
      setDetails(data);
    } catch (err) {
      const msg = err.message || '';

      if (
        msg.toLowerCase().includes('401') ||
        msg.toLowerCase().includes('token') ||
        msg.toLowerCase().includes('jwt') ||
        msg.toLowerCase().includes('unauthorized')
      ) {
        logoutUser();
        navigate('/login');
        return;
      }

      showToast(msg || 'Failed to load event details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    if (getUserRole() !== 'ADMIN') {
      navigate('/');
      return;
    }

    fetchDetails();
  }, [id, navigate]);

  const handleComplete = async () => {
    try {
      setActionLoading(true);
      await completeEvent(id);
      await fetchDetails();
      showToast('Event completed successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to complete event', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      await rejectEvent(id);
      await fetchDetails();
      showToast('Event rejected successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to reject event', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container center-text">
        <h2>Loading admin event details...</h2>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="page-container center-text">
        <h2>Event details could not be loaded.</h2>
        <div className="inline-action-row">
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="secondary-button"
            type="button"
          >
            Back to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { event, venue, vendors, bookings, totalBookings, totalTickets, availableSeats } = details;

  return (
    <div className="page-container">
      <div className="back-button-wrap">
        <button
          onClick={() => navigate('/admin-dashboard')}
          className="ghost-button"
          type="button"
        >
          Back to Admin Dashboard
        </button>
      </div>

      <h1 className="page-title">{event.title}</h1>

      <div className="card center-text">
        <div className="info-grid">
          <p>
            <strong>Description:</strong> {event.description}
          </p>
          <p>
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Time:</strong>{' '}
            {new Date(event.date).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p>
            <strong>Status:</strong> {event.status}
          </p>
          <p>
            <strong>Created By:</strong> {event.createdBy}
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

        {bookings && bookings.length > 0 && (
          <div className="list-stack">
            {bookings.map((booking) => (
              <div key={booking.id} className="compact-card center-text">
                <div className="info-grid">
                  <p>
                    <strong>User Email:</strong> {booking.userEmail}
                  </p>
                  <p>
                    <strong>Tickets:</strong> {booking.tickets}
                  </p>
                  <p>
                    <strong>Status:</strong> {booking.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="divider" />

      <div className="inline-action-row">
        <button
          onClick={handleComplete}
          disabled={actionLoading}
          className="secondary-button"
          type="button"
        >
          {actionLoading ? 'Processing...' : 'Complete'}
        </button>

        <button
          onClick={handleReject}
          disabled={actionLoading}
          className="danger-button"
          type="button"
        >
          {actionLoading ? 'Processing...' : 'Reject'}
        </button>
      </div>
    </div>
  );
}

export default AdminEventDetails;