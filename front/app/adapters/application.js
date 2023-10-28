import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default class ProductsAdapter extends JSONAPIAdapter {
  @service session;
  @service currentUser;

  host = 'http://localhost:3000';
  namespace = 'api';

  @computed(
    'session.authenticator.token',
    'session.data.authenticated.token',
    'session.isAuthenticated',
  )
  get headers() {
    let headers = {};
    if (this.session.isAuthenticated) {
      headers['authorization-token'] = this.session.data.authenticated.token;
    }
    return headers;
  }

  buildURL(modelName, id, snapshot, requestType, query) {
    let url = super.buildURL(modelName, id, snapshot, requestType, query);
    if (id) {
      url = url.replace(id, encodeURIComponent(id));
    }
    return url;
  }
}