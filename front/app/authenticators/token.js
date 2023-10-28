import Base from 'ember-simple-auth/authenticators/base';
import fetch from 'fetch';

export default Base.extend({
  restore(data) {},

  async authenticate(username, password) {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      return response.json();
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  },

  async invalidate(data) {
    const response = await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization-token': data.token,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
  },
});
