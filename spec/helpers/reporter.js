const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
const reporter = new SpecReporter({
  spec: {
    displayPending: true
  }
});

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(reporter);
