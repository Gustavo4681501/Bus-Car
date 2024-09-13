// src/api/authApi.js
const API_URL = 'http://localhost:3000';

export const loginUser = async (userInfo) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    const token = response.headers.get('Authorization');
    localStorage.setItem('token', token);

    return token;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);

    localStorage.removeItem('token');
  } catch (error) {
    throw error;
  }
};

export const signupUser = async (userInfo) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    const token = response.headers.get('Authorization');
    localStorage.setItem('token', token);

    return token;
  } catch (error) {
    throw error;
  }
};
