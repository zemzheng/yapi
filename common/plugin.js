const path = require('path');
const _ = require('underscore');

/**
   * type @string enum[plugin, ext] plugin是外部插件，ext是内部插件
   */
exports.initPlugins = function (plugins, type) {
  if (!plugins) {
    return [];
  }
  if (typeof plugins !== 'object' || !Array.isArray(plugins)) {
    throw new Error('插件配置有误，请检查', plugins);
  }
  const defaultPrefix = 'ext' === type ? path.join( __dirname,  '..', 'exts' , 'yapi-plugin-' ) : 'yapi-plugin-';

  return _.uniq(
    plugins.map(item => {
      if(!item) return;
      const fullItem = typeof item === 'string'
        ? { name : item }
        : item;

      const { name, enable = true } = fullItem;
      const realPath = fullItem.require
        ? fullItem.require
        : path.resolve(defaultPrefix + name);
      const { server, client } = require(realPath);

      return {
        enable,
        name,
        realPath,
        server,
        client,
      }
    }).filter(item => {
      return item.enable === true && (item.server || item.client)
    }),
    item => item.name
  );
}
