'use strict';

const grafana = require('./grafana');

module.exports = router => {
  router.post('/:componentId/:status?', grafana.receiveWebhook);
  return router;
};
