import Ember from 'ember';

export default Ember.Service.extend({
  deserialize(issues) {
    const issuesArray = [],
      farm = issues['-KmWsEzmWNydtknYXNQ4'];

    Object.keys(farm).forEach(key => {
      issuesArray.push(farm[key])
    });

    return {
      type: 'FeatureCollection',
      features: issuesArray.map(issue => {
        if (!issue.category) {
          issue.category = 'Other';
        }

        return Object.assign({}, issue, {
          "type": 'Feature',
          "properties": {
            'icon': 'circle',
            'category': issue.category,
            "description": issue.description
          }
        })
      })
    };
  }
});
