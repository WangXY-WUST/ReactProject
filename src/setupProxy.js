const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/horn',
    createProxyMiddleware({
      target: 'https://portal-portm.meituan.com',
      changeOrigin: true,
      // pathRewrite: { '^/api1': '' }
    })
  );
};