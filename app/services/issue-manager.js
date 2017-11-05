import Ember from 'ember';
import { Promise } from 'rsvp';

export default Ember.Service.extend({
  fakeData: Ember.inject.service(),

  all() {
    return new Promise (resolve => {
      resolve(this.get('fakeData').getIssues())
    });
  }
});
