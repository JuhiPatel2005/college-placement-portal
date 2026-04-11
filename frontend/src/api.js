const baseUrl = "http://localhost:5000/api";

const parseJson = async (response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }
  return data;
};

export const loginUser = (payload) =>
  fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(parseJson);

export const registerUser = (payload) =>
  fetch(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(parseJson);

export const getCurrentUser = (token) =>
  fetch(`${baseUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(parseJson);

export const fetchOpportunities = (token) =>
  fetch(`${baseUrl}/opportunities`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(parseJson);

export const createOpportunity = (token, payload) =>
  fetch(`${baseUrl}/opportunities`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then(parseJson);

export const fetchApplications = (token, role) => {
  const url =
    role === "student"
      ? `${baseUrl}/applications/student`
      : `${baseUrl}/applications`;
  return fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(
    parseJson,
  );
};

export const updateProfile = (token, payload) =>
  fetch(`${baseUrl}/auth/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then(parseJson);

export const fetchUsers = (token) =>
  fetch(`${baseUrl}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(parseJson);

export const updateUser = (token, id, payload) =>
  fetch(`${baseUrl}/users/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then(parseJson);

export const applyToOpportunity = (token, formData) =>
  fetch(`${baseUrl}/applications/apply`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(parseJson);

export const updateApplicationStatus = (token, id, payload) =>
  fetch(`${baseUrl}/applications/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then(parseJson);
