import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CustomersRoute extends Route {
  @service store;
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model() {
    return this.store.findAll('customer');
  }
}
