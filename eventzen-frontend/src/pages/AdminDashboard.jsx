import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, getUserRole, logoutUser } from '../services/authService';
import { useToast } from '../hooks/useToast';
import {
  getAllEvents,
  getAdminVenues,
  getAdminVendors,
  addVenue,
  deleteVenue,
  addVendor,
  deleteVendor,
  downloadBudgetPdf
} from '../services/eventService';

function AdminDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('events');
  const [isVenueFormOpen, setIsVenueFormOpen] = useState(false);
  const [isVendorFormOpen, setIsVendorFormOpen] = useState(false);

  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [loading, setLoading] = useState(true);

  const [venueForm, setVenueForm] = useState({
    name: '',
    location: '',
    capacity: '',
    price: '',
    phoneNumber: ''
  });

  const [vendorForm, setVendorForm] = useState({
    name: '',
    type: '',
    price: '',
    phoneNumber: ''
  });

  const LOCATION_OPTIONS = ['Kolkata', 'Bengaluru', 'Mumbai', 'Delhi'];
  const VENDOR_TYPE_OPTIONS = ['Food', 'Photography', 'Decoration', 'Lights & Sound'];

  const isValidPhoneNumber = (phoneNumber) => /^[0-9]{10}$/.test(phoneNumber);

  const loadDashboardData = async () => {
    try {
      const [eventsData, venuesData, vendorsData] = await Promise.all([
        getAllEvents(),
        getAdminVenues(),
        getAdminVendors()
      ]);

      setEvents(eventsData || []);
      setVenues(venuesData || []);
      setVendors(vendorsData || []);
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

      showToast(msg || 'Failed to load admin dashboard', 'error');
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

    loadDashboardData();
  }, [navigate]);

  const approvedEvents = useMemo(
    () => events.filter((event) => event.status === 'APPROVED'),
    [events]
  );

  const completedEvents = useMemo(
    () => events.filter((event) => event.status === 'COMPLETED'),
    [events]
  );

  const rejectedEvents = useMemo(
    () => events.filter((event) => event.status === 'REJECTED'),
    [events]
  );

  const upcomingBudgetTotal = useMemo(
    () => approvedEvents.reduce((sum, event) => sum + Number(event.totalBudget || 0), 0),
    [approvedEvents]
  );

  const completedBudgetTotal = useMemo(
    () => completedEvents.reduce((sum, event) => sum + Number(event.totalBudget || 0), 0),
    [completedEvents]
  );

  const rejectedBudgetTotal = useMemo(
    () => rejectedEvents.reduce((sum, event) => sum + Number(event.totalBudget || 0), 0),
    [rejectedEvents]
  );

  const venuesByLocation = useMemo(() => {
    return {
      Kolkata: venues.filter((venue) => venue.location === 'Kolkata'),
      Bengaluru: venues.filter((venue) => venue.location === 'Bengaluru'),
      Mumbai: venues.filter((venue) => venue.location === 'Mumbai'),
      Delhi: venues.filter((venue) => venue.location === 'Delhi')
    };
  }, [venues]);

  const vendorsByType = useMemo(() => {
    return {
      Food: vendors.filter((vendor) => vendor.type === 'Food'),
      Photography: vendors.filter((vendor) => vendor.type === 'Photography'),
      Decoration: vendors.filter((vendor) => vendor.type === 'Decoration'),
      'Lights & Sound': vendors.filter((vendor) => vendor.type === 'Lights & Sound')
    };
  }, [vendors]);

  const handleAddVenue = async (e) => {
    e.preventDefault();

    if (!venueForm.name.trim()) {
      showToast('Venue name is required', 'error');
      return;
    }

    if (!venueForm.location) {
      showToast('Venue location is required', 'error');
      return;
    }

    if (!venueForm.capacity) {
      showToast('Venue capacity is required', 'error');
      return;
    }

    if (!venueForm.price) {
      showToast('Venue price is required', 'error');
      return;
    }

    if (!venueForm.phoneNumber.trim()) {
      showToast('Phone number is required', 'error');
      return;
    }

    if (!isValidPhoneNumber(venueForm.phoneNumber)) {
      showToast('Phone number must contain exactly 10 digits only', 'error');
      return;
    }

    try {
      await addVenue({
        ...venueForm,
        capacity: Number(venueForm.capacity),
        price: Number(venueForm.price)
      });

      setVenueForm({
        name: '',
        location: '',
        capacity: '',
        price: '',
        phoneNumber: ''
      });
      setIsVenueFormOpen(false);

      await loadDashboardData();
      showToast('Venue added successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to add venue', 'error');
    }
  };

  const handleDeleteVenue = async (id) => {
    try {
      await deleteVenue(id);
      await loadDashboardData();
      showToast('Venue deleted successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete venue', 'error');
    }
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();

    if (!vendorForm.name.trim()) {
      showToast('Vendor name is required', 'error');
      return;
    }

    if (!vendorForm.type) {
      showToast('Vendor type is required', 'error');
      return;
    }

    if (!vendorForm.price) {
      showToast('Vendor price is required', 'error');
      return;
    }

    if (!vendorForm.phoneNumber.trim()) {
      showToast('Phone number is required', 'error');
      return;
    }

    if (!isValidPhoneNumber(vendorForm.phoneNumber)) {
      showToast('Phone number must contain exactly 10 digits only', 'error');
      return;
    }

    try {
      await addVendor({
        ...vendorForm,
        price: Number(vendorForm.price)
      });

      setVendorForm({
        name: '',
        type: '',
        price: '',
        phoneNumber: ''
      });
      setIsVendorFormOpen(false);

      await loadDashboardData();
      showToast('Vendor added successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to add vendor', 'error');
    }
  };

  const handleDeleteVendor = async (id) => {
    try {
      await deleteVendor(id);
      await loadDashboardData();
      showToast('Vendor deleted successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete vendor', 'error');
    }
  };

  const handleDownloadBudgetPdf = async () => {
    try {
      await downloadBudgetPdf();
      showToast('Budget PDF downloaded successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to download budget PDF', 'error');
    }
  };

  const renderEventSection = (heading, sectionEvents) => (
    <div className="resource-section-box">
      <h3 className="resource-section-heading">{heading}</h3>

      {sectionEvents.length === 0 ? (
        <p className="empty-state resource-section-empty">No events found in this section.</p>
      ) : (
        <div className="resource-card-grid">
          {sectionEvents.map((event) => (
            <div key={event.id} className="resource-card event-resource-card">
              <div className="resource-card-content">
                <p><strong>Title:</strong> {event.title}</p>
                <p><strong>Description:</strong> {event.description}</p>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
                <p><strong>Status:</strong> {event.status}</p>
                <p><strong>Created By:</strong> {event.createdBy}</p>
              </div>

              <div className="resource-card-actions">
                <button
                  onClick={() => navigate(`/admin-event/${event.id}`)}
                  className="secondary-button"
                  type="button"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBudgetSection = (heading, sectionEvents, total) => (
    <div className="resource-section-box">
      <div className="budget-section-header">
        <h3 className="resource-section-heading budget-section-title">{heading}</h3>
        <div className="budget-total-badge">TOTAL: {total}</div>
      </div>

      {sectionEvents.length === 0 ? (
        <p className="empty-state resource-section-empty">No events found in this section.</p>
      ) : (
        <div className="budget-rows">
          {sectionEvents.map((event) => (
            <div key={event.id} className="budget-row">
              <div className="budget-row-left">
                <div className="budget-row-title">{event.title}</div>
                <div className="budget-row-date">
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </div>

              <div className="budget-row-right">
                {Number(event.totalBudget || 0)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderVenueSection = (location) => (
    <div key={location} className="resource-section-box">
      <h3 className="resource-section-heading">{location}</h3>

      {venuesByLocation[location].length === 0 ? (
        <p className="empty-state resource-section-empty">No venues found in this location.</p>
      ) : (
        <div className="resource-card-grid">
          {venuesByLocation[location].map((venue) => (
            <div key={venue.id} className="resource-card">
              <div className="resource-card-content">
                <p><strong>Name:</strong> {venue.name}</p>
                <p><strong>Location:</strong> {venue.location}</p>
                <p><strong>Capacity:</strong> {venue.capacity}</p>
                <p><strong>Price:</strong> {venue.price}</p>
                <p><strong>Phone:</strong> {venue.phoneNumber}</p>
                <p><strong>Available:</strong> {venue.isAvailable ? 'Yes' : 'No'}</p>
              </div>

              <div className="resource-card-actions">
                <button
                  onClick={() => {
                    const confirmed = window.confirm(
                      'Are you sure you want to delete this venue? If it is assigned in any approved event, deletion will be blocked.'
                    );

                    if (confirmed) {
                      handleDeleteVenue(venue.id);
                    }
                  }}
                  className="danger-button"
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderVendorSection = (type) => (
    <div key={type} className="resource-section-box">
      <h3 className="resource-section-heading">{type}</h3>

      {vendorsByType[type].length === 0 ? (
        <p className="empty-state resource-section-empty">No vendors found in this section.</p>
      ) : (
        <div className="resource-card-grid">
          {vendorsByType[type].map((vendor) => (
            <div key={vendor.id} className="resource-card">
              <div className="resource-card-content">
                <p><strong>Name:</strong> {vendor.name}</p>
                <p><strong>Type:</strong> {vendor.type}</p>
                <p><strong>Price:</strong> {vendor.price}</p>
                <p><strong>Phone:</strong> {vendor.phoneNumber}</p>
                <p><strong>Available:</strong> {vendor.isAvailable ? 'Yes' : 'No'}</p>
              </div>

              <div className="resource-card-actions">
                <button
                  onClick={() => {
                    const confirmed = window.confirm(
                      'Are you sure you want to delete this vendor? If it is assigned in any approved event, deletion will be blocked.'
                    );

                    if (confirmed) {
                      handleDeleteVendor(vendor.id);
                    }
                  }}
                  className="danger-button"
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="page-container center-text">
        <h2>Loading admin dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Admin Dashboard</h1>

      <div className="tab-row">
        <button
          onClick={() => setActiveTab('events')}
          className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
          type="button"
        >
          Manage Events
        </button>

        <button
          onClick={() => setActiveTab('venues')}
          className={`tab-button ${activeTab === 'venues' ? 'active' : ''}`}
          type="button"
        >
          Manage Venues
        </button>

        <button
          onClick={() => setActiveTab('vendors')}
          className={`tab-button ${activeTab === 'vendors' ? 'active' : ''}`}
          type="button"
        >
          Manage Vendors
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`tab-button ${activeTab === 'budget' ? 'active' : ''}`}
          type="button"
        >
          Budget
        </button>
      </div>

      {activeTab === 'events' && (
        <div>
          <h2 className="section-title">Manage Events</h2>

          <div className="resource-sections-stack">
            {renderEventSection('Upcoming Events', approvedEvents)}
            {renderEventSection('Completed Events', completedEvents)}
            {renderEventSection('Rejected Events', rejectedEvents)}
          </div>
        </div>
      )}

      {activeTab === 'venues' && (
        <div>
          <h2 className="section-title">Manage Venues</h2>

          <div className="compact-toolbar compact-toolbar-button-only">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setIsVenueFormOpen((prev) => !prev)}
            >
              {isVenueFormOpen ? 'Close Form' : 'Add New Venue'}
            </button>
          </div>

          {isVenueFormOpen && (
            <div className="card form-card collapsible-panel">
              <form onSubmit={handleAddVenue}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Venue Name</label>
                    <input
                      type="text"
                      placeholder="Enter venue name"
                      value={venueForm.name}
                      onChange={(e) => setVenueForm({ ...venueForm, name: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <select
                      value={venueForm.location}
                      onChange={(e) => setVenueForm({ ...venueForm, location: e.target.value })}
                      className="select-field"
                    >
                      <option value="">Select Location</option>
                      {LOCATION_OPTIONS.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Capacity</label>
                    <input
                      type="number"
                      placeholder="Enter venue capacity"
                      value={venueForm.capacity}
                      onChange={(e) => setVenueForm({ ...venueForm, capacity: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      placeholder="Enter venue price"
                      value={venueForm.price}
                      onChange={(e) => setVenueForm({ ...venueForm, price: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength="10"
                      placeholder="Enter 10-digit phone number"
                      value={venueForm.phoneNumber}
                      onChange={(e) =>
                        setVenueForm({
                          ...venueForm,
                          phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10)
                        })
                      }
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="primary-button">
                    Add Venue
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="resource-sections-stack">
            {LOCATION_OPTIONS.map(renderVenueSection)}
          </div>
        </div>
      )}

      {activeTab === 'vendors' && (
        <div>
          <h2 className="section-title">Manage Vendors</h2>

          <div className="compact-toolbar compact-toolbar-button-only">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setIsVendorFormOpen((prev) => !prev)}
            >
              {isVendorFormOpen ? 'Close Form' : 'Add New Vendor'}
            </button>
          </div>

          {isVendorFormOpen && (
            <div className="card form-card collapsible-panel">
              <form onSubmit={handleAddVendor}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Vendor Name</label>
                    <input
                      type="text"
                      placeholder="Enter vendor name"
                      value={vendorForm.name}
                      onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select
                      value={vendorForm.type}
                      onChange={(e) => setVendorForm({ ...vendorForm, type: e.target.value })}
                      className="select-field"
                    >
                      <option value="">Select Type</option>
                      {VENDOR_TYPE_OPTIONS.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      placeholder="Enter vendor price"
                      value={vendorForm.price}
                      onChange={(e) => setVendorForm({ ...vendorForm, price: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength="10"
                      placeholder="Enter 10-digit phone number"
                      value={vendorForm.phoneNumber}
                      onChange={(e) =>
                        setVendorForm({
                          ...vendorForm,
                          phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10)
                        })
                      }
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="primary-button">
                    Add Vendor
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="resource-sections-stack">
            {VENDOR_TYPE_OPTIONS.map(renderVendorSection)}
          </div>
        </div>
      )}

      {activeTab === 'budget' && (
        <div>
          <div className="budget-page-header">
            <h2 className="section-title budget-page-title">TRACK BUDGET</h2>

            <button
              type="button"
              className="secondary-button"
              onClick={handleDownloadBudgetPdf}
            >
              Download PDF
            </button>
          </div>

          <div className="resource-sections-stack">
            {renderBudgetSection('Upcoming Events', approvedEvents, upcomingBudgetTotal)}
            {renderBudgetSection('Completed Events', completedEvents, completedBudgetTotal)}
            {renderBudgetSection('Rejected Events', rejectedEvents, rejectedBudgetTotal)}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;