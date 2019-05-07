import { run } from '@ember/runloop';
import { assign } from '@ember/polyfills';
import Application from '../../app';
import config from '../../config/environment';

export default function startApp(attrs) {
  const attributes = assign({}, config.APP, attrs);

  run(() => {
    const application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });
}
