import { scheduleOnce } from '@ember/runloop';
import { Promise } from 'rsvp';

export default function afterRender(promise) {
  return promise.catch(() => {}).finally(() => {
    return new Promise(function (resolve) {
      scheduleOnce('afterRender', resolve);
    });
  });
}
