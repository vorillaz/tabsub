const channel = new BroadcastChannel('tabsub-demo');
channel.onmessage = ({data}) => {
  const parsed = JSON.stringify({
    data
  });
  document.getElementById('msgs').innerHTML = parsed;
};

document.getElementById('send').addEventListener('click', () => {
  const msg = document.getElementById('msg').value;
  channel.postMessage(msg);
});
