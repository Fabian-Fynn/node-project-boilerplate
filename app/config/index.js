import secrets from './secrets';

const config = {
  projectKey: 'projectName',
  projectName: 'project name',
  nodeEnv: process.env.NODE_ENV || 'test',
  port: process.env.PORT || '3344',
  secrets,
};

config.db = `mongodb://localhost/${config.projectKey}`;

export default config;
