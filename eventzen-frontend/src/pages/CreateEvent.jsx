import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, logoutUser } from '../services/authService';
import { useToast } from '../hooks/useToast';
import { getVenues, getVendors, createEvent } from '../services/eventService';

function CreateEvent() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [venueId, setVenueId] = useState('');
  const [vendorIds, setVendorIds] = useState([]);

  const [venues, setVenues] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const LOCATION_ORDER = ['Kolkata', 'Bengaluru', 'Mumbai', 'Delhi'];
  const VENDOR_TYPE_ORDER = ['Food', 'Photography', 'Decoration', 'Lights & Sound'];

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [venueData, vendorData] = await Promise.all([getVenues(), getVendors()]);

        setVenues(venueData || []);
        setVendors(vendorData || []);
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

        showToast(msg || 'Failed to load venues and vendors', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, showToast]);

  const handleVendorChange = (vendorId) => {
    setVendorIds((prev) => {
      if (prev.includes(vendorId)) {
        return prev.filter((id) => id !== vendorId);
      }
      return [...prev, vendorId];
    });
  };

  const sortedVenues = useMemo(() => {
    return [...venues].sort((a, b) => {
      const locationDiff =
        LOCATION_ORDER.indexOf(a.location) - LOCATION_ORDER.indexOf(b.location);

      if (locationDiff !== 0) {
        return locationDiff;
      }

      return a.name.localeCompare(b.name);
    });
  }, [venues]);

  const sortedVendors = useMemo(() => {
    return [...vendors].sort((a, b) => {
      const typeDiff =
        VENDOR_TYPE_ORDER.indexOf(a.type) - VENDOR_TYPE_ORDER.indexOf(b.type);

      if (typeDiff !== 0) {
        return typeDiff;
      }

      return a.name.localeCompare(b.name);
    });
  }, [vendors]);

  const groupedVenues = useMemo(() => {
    return LOCATION_ORDER.map((location) => ({
      location,
      items: sortedVenues.filter((venue) => venue.location === location)
    })).filter((group) => group.items.length > 0);
  }, [sortedVenues]);

  const groupedVendors = useMemo(() => {
    return VENDOR_TYPE_ORDER.map((type) => ({
      type,
      items: sortedVendors.filter((vendor) => vendor.type === type)
    })).filter((group) => group.items.length > 0);
  }, [sortedVendors]);

  const selectedVenue = useMemo(() => {
    return venues.find((venue) => Number(venue.id) === Number(venueId)) || null;
  }, [venues, venueId]);

  const selectedVendors = useMemo(() => {
    return vendors.filter((vendor) => vendorIds.includes(vendor.id));
  }, [vendors, vendorIds]);

  const totalExpenditure = useMemo(() => {
    const venuePrice = selectedVenue ? Number(selectedVenue.price || 0) : 0;

    const vendorTotal = selectedVendors.reduce((sum, vendor) => {
      return sum + Number(vendor.price || 0);
    }, 0);

    return venuePrice + vendorTotal;
  }, [selectedVenue, selectedVendors]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    if (!description.trim()) {
      showToast('Description is required', 'error');
      return;
    }

    if (!date) {
      showToast('Date is required', 'error');
      return;
    }

    if (venues.length === 0) {
      showToast('No venues are available right now', 'error');
      return;
    }

    if (vendors.length === 0) {
      showToast('No vendors are available right now', 'error');
      return;
    }

    if (!venueId) {
      showToast('Please select a venue', 'error');
      return;
    }

    if (vendorIds.length === 0) {
      showToast('Please select at least one vendor', 'error');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        title,
        description,
        date,
        venueId: Number(venueId),
        vendorIds: vendorIds.map(Number)
      };

      await createEvent(payload);

      setTitle('');
      setDescription('');
      setDate('');
      setVenueId('');
      setVendorIds([]);

      showToast('Event created successfully', 'success');

      setTimeout(() => {
        navigate('/profile');
      }, 900);
    } catch (err) {
      showToast(err.message || 'Failed to create event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container center-text">
        <h2>Loading form data...</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Create Event</h1>

      <div className="card form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label"><h3>Title</h3></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Enter event title"
            />
          </div>

          <div className="form-group">
            <label className="form-label"><h3>Description</h3></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="textarea-field"
              placeholder="Describe your event"
            />
          </div>

          <div className="form-group">
            <label className="form-label"><h3>Date</h3></label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label className="form-label"><h3>Select Venue</h3></label>

            {venues.length === 0 ? (
              <p className="empty-state">No venues available right now.</p>
            ) : (
              <select
                value={venueId}
                onChange={(e) => setVenueId(e.target.value)}
                className="select-field"
              >
                <option value="">-- Select Venue --</option>

                {groupedVenues.map((group) => (
                  <optgroup key={group.location} label={group.location}>
                    {group.items.map((venue) => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name} | Capacity: {venue.capacity} | Price: {venue.price}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label className="form-label"><h3>Select Vendors</h3></label>

            {vendors.length === 0 ? (
              <p className="empty-state">No vendors available right now.</p>
            ) : (
              <div className="list-stack">
                {groupedVendors.map((group) => (
                  <div
                    key={group.type}
                    className="compact-card"
                    style={{ padding: '16px 18px' }}
                  >
                    <h3
                      style={{
                        marginBottom: '12px',
                        fontSize: '18px',
                        fontWeight: '700'
                      }}
                    >
                      {group.type}
                    </h3>

                    <div className="checkbox-list">
                      {group.items.map((vendor) => (
                        <label
                          key={vendor.id}
                          className="checkbox-item"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '10px'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={vendorIds.includes(vendor.id)}
                            onChange={() => handleVendorChange(vendor.id)}
                          />
                          <span>
                            {vendor.name} | Price: {vendor.price}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="budget-box section-block">
            <h3 style={{ marginBottom: '12px' }}>Total Expenditure</h3>

            <div className="info-grid">
              <p>
                <strong>Selected Venue Price:</strong> {selectedVenue ? selectedVenue.price : 0}
              </p>
              <p>
                <strong>Selected Vendors Total:</strong>{' '}
                {selectedVendors.reduce((sum, vendor) => sum + Number(vendor.price || 0), 0)}
              </p>
              <p>
                <strong>Final Total:</strong> {totalExpenditure}
              </p>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={submitting || venues.length === 0 || vendors.length === 0}
              className="secondary-button"
            >
              {submitting ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;