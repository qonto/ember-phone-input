'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

// Needed for ember-source < 4.8, when preview types were first shipped
const emberTypesPackages = {
  '@types/ember__application': '^4.0.8',
  '@types/ember__owner': '^4.0.8',
  '@types/ember__routing': '^4.0.17'
};

module.exports = async function () {
  return {
    usePnpm: true,
    scenarios: [
      {
        name: 'ember-lts-3.28',
        npm: {
          devDependencies: {
            'ember-source': '~3.28.0',
            ...emberTypesPackages
          }
        }
      },
      {
        name: 'ember-lts-4.4',
        npm: {
          devDependencies: {
            'ember-source': '~4.4.0',
            ...emberTypesPackages
          }
        }
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release')
          }
        }
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('beta')
          }
        }
      },
      {
        name: 'ember-canary',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('canary')
          }
        }
      },
      {
        name: 'ember-classic',
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'application-template-wrapper': true,
            'default-async-observers': false,
            'template-only-glimmer-components': false
          })
        },
        npm: {
          devDependencies: {
            'ember-source': '~3.28.0',
            ...emberTypesPackages
          },
          ember: {
            edition: 'classic'
          }
        }
      },
      embroiderSafe({
        npm: {
          devDependencies: {
            '@embroider/compat': '^3.2.1',
            '@embroider/core': '^3.2.1',
            '@embroider/webpack': '^3.1.5'
          }
        }
      }),
      embroiderOptimized({
        npm: {
          devDependencies: {
            '@embroider/compat': '^3.2.1',
            '@embroider/core': '^3.2.1',
            '@embroider/webpack': '^3.1.5'
          }
        }
      })
    ]
  };
};
