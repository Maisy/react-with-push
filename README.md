## show chrome notification with service worker in react

1. add new file `service-worker.js` in public/
2. `src/serviceWorker.js`

- remove `NODE_ENV=== 'production'` to test in development env.

```js
export function register(config) {
  if ('serviceWorker' in navigator) { // <- fix here
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // ...
```

3. `index.js`: change serviceWorker.unregister to register

```js
serviceWorker.register();
```
