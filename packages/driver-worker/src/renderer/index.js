/* global DEVICE_WIDTH */
import MutationHandler from './MutationHandler';
import EvaluationHandler from './EvaluationHandler';
import LocationHandler from './LocationHandler';

export default ({ worker, options }) => {
  const postMessage = worker.postMessage.bind(worker);

  const handlers = {
    MutationRecord: new MutationHandler(postMessage, options),
    EvaluationRecord: new EvaluationHandler(postMessage, options),

    // Deprecated handler.
    Location: new LocationHandler(postMessage, options),
  };

  worker.onmessage = ({ data }) => {
    let type = data.type;
    if (handlers[type]) {
      handlers[type].apply(data);
    } else {
      console.error('Can not handle with ' + type, data);
    }
  };

  worker.postMessage({
    type: 'init',
    url: location.href,
    width: getDeviceWidth(),
  });
};

/**
 * Get device base width
 * @return {number}
 */
function getDeviceWidth() {
  return typeof DEVICE_WIDTH !== 'undefined'
    ? DEVICE_WIDTH
    : document.documentElement.clientWidth;
}
