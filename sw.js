if(!self.define){let e,i={};const s=(s,n)=>(s=new URL(s+".js",n).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let d={};const o=e=>s(e,t),f={module:{uri:t},exports:d,require:o};i[t]=Promise.all(n.map((e=>f[e]||o(e)))).then((e=>(r(...e),d)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-C0UdFbu2.css",revision:null},{url:"assets/index-D3PP8ZHS.js",revision:null},{url:"index.html",revision:"202372997fea196da6f2ebcbdfddbe1c"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"pwa-192x192.png",revision:"8ddbf06a0ff4ade09c3895abe241ad40"},{url:"pwa-512x512.png",revision:"8f4e1ef71b80ab8597adcf63925fb755"},{url:"manifest.webmanifest",revision:"baa01a256b25d052b8e8618276df76e5"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
