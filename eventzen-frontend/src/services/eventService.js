import { getToken, logoutUser } from './authService';

const BASE_URL = 'http://localhost:5000/api';

// helper to safely parse JSON
const parseJsonSafely = async (response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

// helper to get auth header
const getAuthHeaders = () => {
  const token = getToken();

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
};

// helper for protected API errors
const handleProtectedError = async (response, defaultMessage) => {
  const data = await parseJsonSafely(response);

  if (!response.ok) {
    if (response.status === 401) {
      logoutUser();
    }

    throw new Error(data?.message || `${defaultMessage} (${response.status})`);
  }

  return data;
};

// PUBLIC: Get all public events
export const getPublicEvents = async () => {
  const response = await fetch(`${BASE_URL}/public/events`);

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(data?.message || `Failed to fetch public events (${response.status})`);
  }

  return data;
};

// PUBLIC: Get one public event details
export const getPublicEventDetails = async (id) => {
  const response = await fetch(`${BASE_URL}/public/event/${id}`);

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(data?.message || `Failed to fetch public event details (${response.status})`);
  }

  return data;
};

// CUSTOMER: Get available vendors
export const getVendors = async () => {
  const response = await fetch(`${BASE_URL}/customer/vendors`, {
    headers: getAuthHeaders()
  });

  return handleProtectedError(response, 'Failed to fetch vendors');
};

// CUSTOMER: Get available venues
export const getVenues = async () => {
  const response = await fetch(`${BASE_URL}/customer/venues`, {
    headers: getAuthHeaders()
  });

  return handleProtectedError(response, 'Failed to fetch venues');
};

// CUSTOMER: Get my events
export const getMyEvents = async () => {
  const response = await fetch(`${BASE_URL}/customer/events`, {
    headers: getAuthHeaders()
  });

  return handleProtectedError(response, 'Failed to fetch my events');
};

// CUSTOMER: Create event
export const createEvent = async (eventData) => {
  const response = await fetch(`${BASE_URL}/customer/event`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(eventData)
  });

  return handleProtectedError(response, 'Failed to create event');
};

// CUSTOMER: Get customer event details
export const getCustomerEventDetails = async (id) => {
  const response = await fetch(`${BASE_URL}/customer/event/${id}`, {
    headers: getAuthHeaders()
  });

  return handleProtectedError(response, 'Failed to fetch event details');
};

// CUSTOMER: Book an event
export const bookEvent = async (bookingData) => {
  const response = await fetch(`${BASE_URL}/customer/book`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData)
  });

  return handleProtectedError(response, 'Failed to book event');
};

// CUSTOMER: Get my bookings
export const getMyBookings = async () => {
  const response = await fetch(`${BASE_URL}/customer/bookings`, {
    headers: getAuthHeaders()
  });

  return handleProtectedError(response, 'Failed to fetch my bookings');
};

// ADMIN: Get all events
export const getAllEvents = async () => {
  const response = await fetch(`${BASE_URL}/admin/events`, {
    headers: getAuthHeaders()
  });

  return handleProtectedError(response, 'Failed to fetch all events');
};

// ADMIN: Get all venues
export const getAdminVenues = async () => {
  const response = await fetch(`${BASE_URL}/admin/venues`, {
    headers: getAuthHeaders()
  });

  return handleProtectedError(response, 'Failed to fetch admin venues');
};

// ADMIN: Get all vendors
export const getAdminVendors = async () => {
  const response = await fetch(`${BASE_URL}/admin/vendors`, {
    headers: getAuthHeaders()
  });

  return handleProtectedError(response, 'Failed to fetch admin vendors');
};

// ADMIN: Add venue
export const addVenue = async (venueData) => {
  const response = await fetch(`${BASE_URL}/admin/venue`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(venueData)
  });

  return handleProtectedError(response, 'Failed to add venue');
};

// ADMIN: Delete venue
export const deleteVenue = async (id) => {
  const response = await fetch(`${BASE_URL}/admin/venue/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  return handleProtectedError(response, 'Failed to delete venue');
};

// ADMIN: Add vendor
export const addVendor = async (vendorData) => {
  const response = await fetch(`${BASE_URL}/admin/vendor`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(vendorData)
  });

  return handleProtectedError(response, 'Failed to add vendor');
};

// ADMIN: Delete vendor
export const deleteVendor = async (id) => {
  const response = await fetch(`${BASE_URL}/admin/vendor/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  return handleProtectedError(response, 'Failed to delete vendor');
};

// ADMIN: Get one admin event details
export const getAdminEventDetails = async (id) => {
  const response = await fetch(`${BASE_URL}/admin/event/${id}`, {
    headers: getAuthHeaders()
  });

  return handleProtectedError(response, 'Failed to fetch admin event details');
};

// ADMIN: Complete event
export const completeEvent = async (id) => {
  const response = await fetch(`${BASE_URL}/admin/event/${id}/complete`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });

  return handleProtectedError(response, 'Failed to complete event');
};

// ADMIN: Reject event
export const rejectEvent = async (id) => {
  const response = await fetch(`${BASE_URL}/admin/event/${id}/reject`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });

  return handleProtectedError(response, 'Failed to reject event');
};

// ADMIN: Download overall budget PDF
export const downloadBudgetPdf = async () => {
  const response = await fetch(`${BASE_URL}/admin/budget/pdf`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      logoutUser();
    }

    const data = await parseJsonSafely(response);
    throw new Error(data?.message || `Failed to download budget PDF (${response.status})`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'budget-summary.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};