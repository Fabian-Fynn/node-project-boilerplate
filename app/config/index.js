import secrets from './secrets';

const config = {
  projectKey: 'initiator',
  projectName: 'Initiator',
  copyrightHolder: {
    name: 'Fabian Hoffmann',
    url: 'http://fabianhoffmann.io',
  },
  externalAssetUrl: 'http://assets.fabianhoffmann.io/project-boilerplate',
  nodeEnv: process.env.NODE_ENV || 'test',
  port: process.env.PORT || '3344',
  secrets,
};

config.db = `mongodb://localhost/${config.projectKey}`;

export default config;
