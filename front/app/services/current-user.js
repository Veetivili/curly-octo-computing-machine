// app/services/current-user.js
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CurrentUserService extends Service {
  @service session;

  @tracked username;

  load() {
    if (this.session.isAuthenticated) {
      const { username } = this.session.data.authenticated.data;
      this.username = username;
    }
  }
}
