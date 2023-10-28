import Model, { attr } from '@ember-data/model';

export default class CustomerModel extends Model {
  @attr('string') company;
  @attr('string') contact_person;
  @attr('string') sales_history;
}
