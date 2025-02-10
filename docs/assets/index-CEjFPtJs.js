(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function e(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=e(i);fetch(i.href,o)}})();const h="ws://172.31.177.108:8000/lightctl",l=new WebSocket(h);class r{constructor(t,e){this.x=t,this.y=e}}class d{constructor(t,e,s){this.radius=t,this.velocity=new r(3,1),this.width=e,this.height=s,this.position=new r(e/2,s/2),this.colors=["red","blue","green","black","lightblue","white","orange"],this.colors_index=0}update(){this.position.x+=this.velocity.x,this.position.y+=this.velocity.y,this.position.x-this.radius<=0&&(this.velocity.x*=-1),this.position.y-this.radius<=0&&(this.velocity.y*=-1),this.position.x+this.radius>=this.width&&(this.velocity.x*=-1),this.position.y+this.radius>=this.height&&(this.velocity.y*=-1)}draw(t){this.update(),t.clearRect(0,0,this.width,this.height),t.beginPath(),t.arc(this.position.x,this.position.y,this.radius,0,2*Math.PI),t.fillStyle=this.colors[this.colors_index++],this.colors_index==this.colors.length&&(this.colors_index=0),t.fill(),t.stroke()}}const a=()=>{const n=document.getElementById("canvas"),t=n.getContext("2d"),e=n.width,s=n.height,i=new d(50,e,s);setInterval(()=>{i.draw(t),console.log("render!")},1)},u=n=>{for(let t of Array(n).keys()){t++;const e=document.createElement("input");e.setAttribute("type","checkbox"),e.setAttribute("id",`checkbox_${t}`);const s=document.getElementById("main");if(s===null)return;s.appendChild(e),e.onclick=()=>{console.log("let there be light!!!");const i=JSON.stringify({id:t,action:e.checked});l.send(i)}}};l.onmessage=n=>{const t=n.data,e=JSON.parse(t);if(console.log(e),"count"in e)console.log(`count is: ${e.count}`),u(e.count);else{const s=e.id,i=e.state,o=document.getElementById(`checkbox_${s}`);o.checked=i}};window.addEventListener("DOMContentLoaded",()=>{a()},!1);
