/* eslint-disable no-console */
import Helper from "@ember/component/helper";
import PromiseProxyMixin from "@ember/object/promise-proxy-mixin";
import { resolve } from "rsvp";

export default class MapValueHelper extends Helper {
  _currentPromise;
  _promiseValue;
  _promiseWasSettled;

  compute([action, maybePromise]) {
    return this.resolvePromise(
      maybePromise,
      (value) => {
        return action(value);
      },
      () => {
        this.recompute();
        return null;
      }
    );
  }

  resolvePromise(maybePromise, immediateResolve, delayedResolve, catchResolve) {
    if (!this.isPromise(maybePromise)) {
      this.clearPromise();
      return immediateResolve.call(this, maybePromise);
    }
    if (this.isFulfilled(maybePromise)) {
      this.clearPromise();
      return immediateResolve.call(this, this.getPromiseContent(maybePromise));
    }

    /**
     * If the type wasn't a PromiseProxy or RSVP, check if we resolved for .then
     */
    if (maybePromise === this._currentPromise) {
      if (this._promiseWasSettled) {
        return immediateResolve.call(this, this._promiseValue);
      }
      return null; // Return we don't need to check the latest again
    }

    this.ensureLatestPromise(maybePromise, (promise) => {
      promise
        .then((value) => {
          if (maybePromise === this._currentPromise) {
            this._promiseWasSettled = true;
            this._promiseValue = value;
            // This will recompue the value and fire the _wasSettled check above
            return (delayedResolve || immediateResolve).call(this, value);
          }
        })
        .catch((error) => {
          if (catchResolve) {
            return catchResolve.call(this, error);
          } else {
            console.error(
              "Promise died in promise-resolver and no catchResolve method was passed in."
            );
            console.error(error);
          }
        });
    });
    return null;
  }

  ensureLatestPromise(promise, callback) {
    this.clearPromise(promise);
    callback.call(this, resolve(promise));
  }

  clearPromise(promise = null) {
    // It's a new promise, reset
    this._promiseWasSettled = false;
    this._currentPromise = promise;
  }

  isPromise(maybePromise) {
    return maybePromise != null && typeof maybePromise.then === "function";
  }

  isFulfilled(promise) {
    if (PromiseProxyMixin.detect(promise)) {
      return !!promise.isFulfilled;
    }

    if (promise instanceof Promise) {
      return promise._state === 1;
    }

    // Can't detect it if its not one of the two kinds above
    return false;
  }

  getPromiseContent(promise) {
    if (PromiseProxyMixin.detect(promise)) {
      return promise.content;
    }

    if (promise instanceof Promise) {
      return promise._result;
    }

    // Only can get the content for one of the two above
    return null;
  }
}
