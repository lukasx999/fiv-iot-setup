(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&c(s)}).observe(document,{childList:!0,subtree:!0});function t(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function c(e){if(e.ep)return;e.ep=!0;const o=t(e);fetch(e.href,o)}})();const l="http://172.31.177.108:8000/lightctl",i=new WebSocket(l),d=r=>{for(let n of Array(r).keys()){n++;const t=document.createElement("input");t.setAttribute("type","checkbox"),t.setAttribute("id",`checkbox_${n}`);const c=document.getElementById("main");if(c===null)return;c.appendChild(t),t.onclick=()=>{console.log("let there be light!!!");const e=JSON.stringify({id:n,action:t.checked});i.send(e)}}};i.onmessage=r=>{const n=r.data,t=JSON.parse(n);if(console.log(t),"count"in t)console.log(`count is: ${t.count}`),d(t.count);else{const c=t.id,e=t.state,o=document.getElementById(`checkbox_${c}`);o.checked=e}};window.onload=()=>{};
