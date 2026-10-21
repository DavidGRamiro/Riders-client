const PLUGIN_NAME = 'postcss-fix-dir-selector';

module.exports = function () {
  return {
    postcssPlugin: PLUGIN_NAME,
    Once(root) {
      root.walkRules((rule) => {
        const selector = rule.selector.replace(/\[dir="(ltr|rtl)"\]\*/g, '[dir="$1"] *');
        if (selector !== rule.selector) {
          rule.selector = selector;
        }
      });
    },
  };
};

module.exports.postcss = true;
