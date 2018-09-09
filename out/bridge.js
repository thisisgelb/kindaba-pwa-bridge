"use strict";

var Event_Camera_Roll = 'cameraRoll';
var Event_Camera = 'camera';
var Event_PUSH_NOTIFICATION = 'pushNotifications';

var validateWebView = function validateWebView(webview) {
  if (!webview) {
    throw new Error('Webview should be setup to use React Native Wrapper from RN side.');
  }
};

var sendToReactNative = function sendToReactNative(event) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!isReactNative()) return;
  window && window.postMessage({
    event: event,
    data: data
  });
};

var listenToReactNative = function listenToReactNative(func) {
  if (!isReactNative()) return;

  if (!window) {
    throw new Error('Window object not found.');
  }

  window.receivedMessageFromReactNative = function (data) {
    try {
      var parsedData = JSON.parse(data);
      func(parsedData);
    } catch (err) {
      console.warn("Data received from React Native is not valid JSON. ".concat(data));
      func(data);
    }
  };
};

var unlistenToReactNative = function unlistenToReactNative() {
  if (!isReactNative()) return;

  if (!window) {
    throw new Error('Window object not found.');
  }

  delete window.receivedMessageFromReactNative;
};
/* helpers methods */


var openCameraRoll = function openCameraRoll() {
  return sendToReactNative(Event_Camera_Roll);
};

var openCamera = function openCamera() {
  return sendToReactNative(Event_Camera);
};

var isReactNative = function isReactNative() {
  var isReactNative = !!(window && window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.reactNative);
  console.warn(isReactNative);
  return isReactNative;
};
/* helpers methods */


var handleMessages = function handleMessages(eventMap) {
  return function (e) {
    var event = e.nativeEvent.data.event;
    return eventMap[event]();
  };
};

var sendToWebView = function sendToWebView(webview, event, data) {
  validateWebView(webview);
  var message = JSON.stringify({
    event: event,
    data: data
  });
  webview.evaluateJavaScript("receivedMessageFromReactNative('".concat(message, "')"));
};

module.exports = {
  Event_Camera_Roll: Event_Camera_Roll,
  Event_Camera: Event_Camera,
  Event_PUSH_NOTIFICATION: Event_PUSH_NOTIFICATION,

  /* From PWA to React Native */
  sendToReactNative: sendToReactNative,
  listenToReactNative: listenToReactNative,
  unlistenToReactNative: unlistenToReactNative,
  openCamera: openCamera,
  openCameraRoll: openCameraRoll,
  isReactNative: isReactNative,

  /* From React Native to PWA */
  handleMessages: handleMessages,
  sendToWebView: sendToWebView
};
