const host = window.document.location.host.replace(/:.*/, '');
const ws = new WebSocket('ws://' + host + ':4000');

ws.onmessage = () => {
  document.getElementById('dist-css')
    .setAttribute('href', `/css/dist.css?v=${new Date().getTime()}`);
};
