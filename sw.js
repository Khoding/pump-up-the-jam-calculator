if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let o={};const f=e=>n(e,t),d={module:{uri:t},exports:o,require:f};i[t]=Promise.all(s.map((e=>d[e]||f(e)))).then((e=>(r(...e),o)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-5ekt7h9G.css",revision:null},{url:"assets/index-E6nqm-Up.js",revision:null},{url:"index.html",revision:"2a7e6fff62f04bda848925b34f03f856"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"pwa-192x192.png",revision:"8ddbf06a0ff4ade09c3895abe241ad40"},{url:"pwa-512x512.png",revision:"8f4e1ef71b80ab8597adcf63925fb755"},{url:"manifest.webmanifest",revision:"baa01a256b25d052b8e8618276df76e5"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
