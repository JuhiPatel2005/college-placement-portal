const baseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/** Origin for static assets (e.g. resumes under /uploads), not the /api prefix */
export const serverOrigin =
  baseUrl.replace(/\/api\/?$/i, "") || "http://localhost:5000";

const parseJson = async (response) => {
  const text = await response.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(response.statusText || "Invalid response from server");
    }
  }
  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }
  return data;
};

const defaultOptions = {
  credentials: "include",
};

const request = (url, options) =>
  fetch(url, { ...defaultOptions, ...options })
    .then(parseJson)
    .catch((error) => {
      if (error?.name === "TypeError") {
        throw new Error("Network error. Please check your connection.");
      }
      throw error;
    });

export const loginUser = (payload) =>
  request(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const registerUser = (payload) =>
  request(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const logoutUser = () =>
  request(`${baseUrl}/auth/logout`, {
    method: "POST",
  });

export const getCurrentUser = () => request(`${baseUrl}/auth/me`);

export const fetchOpportunities = (category) => {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  const query = params.toString();
  const url = query ? `${baseUrl}/opportunities?${query}` : `${baseUrl}/opportunities`;
  return request(url);
};

export const createOpportunity = (payload) =>
  request(`${baseUrl}/opportunities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

export const deleteOpportunity = (id) =>
  request(`${baseUrl}/opportunities/${id}`, {
    method: "DELETE",
  });

export const updateOpportunity = (id, payload) =>
  request(`${baseUrl}/opportunities/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

export const fetchApplications = (role) => {
  const url =
    role === "student"
      ? `${baseUrl}/applications/student`
      : `${baseUrl}/applications`;
  return request(url);
};

export const updateProfile = (payload) =>
  request(`${baseUrl}/auth/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

export const fetchUsers = () => request(`${baseUrl}/users`);

export const updateUser = (id, payload) =>
  request(`${baseUrl}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

export const applyToOpportunity = (formData) =>
  request(`${baseUrl}/applications/apply`, {
    method: "POST",
    body: formData,
  });

export const updateApplicationStatus = (id, payload) =>
  request(`${baseUrl}/applications/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

export const uploadOfferLetter = (id, file) => {
  const formData = new FormData();
  formData.append("offerLetter", file, file.name);
  return request(`${baseUrl}/applications/${id}/offer-letter`, {
    method: "POST",
    body: formData,
  });
};
