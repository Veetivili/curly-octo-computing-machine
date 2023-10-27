import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LoginController extends Controller {
  @tracked error;
  @service session;

  @tracked username;
  @tracked password;

  @action
  async login(event) {
    event.preventDefault();

    try {
      await this.session.authenticate(
        'authenticator:token',
        this.username,
        this.password,
      );
    } catch (error) {
      this.error = error;
    }
  }
  @action
  update(attr, event) {
    this[attr] = event.target.value;
  }
}
