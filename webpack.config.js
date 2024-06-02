const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Customize the config before returning it.

  // Ensure the default condition is last in resolve.mainFields
  if (config.resolve && config.resolve.mainFields) {
    const mainFields = config.resolve.mainFields;
    const defaultIndex = mainFields.indexOf('default');
    if (defaultIndex !== -1) {
      mainFields.push(mainFields.splice(defaultIndex, 1)[0]);
    }
  }

  return config;
};
