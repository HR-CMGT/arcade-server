var u=Object.defineProperty;var m=(o,i,e)=>i in o?u(o,i,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[i]=e;var a=(o,i,e)=>(m(o,typeof i!="symbol"?i+"":i,e),e);(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&t(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}})();function l(o,i,e){return Math.min(Math.max(o,i),e)}class g{constructor(i){a(this,"DEBUG",!0);a(this,"numberOfBUttons",0);a(this,"axes",[]);a(this,"previousGamepad");a(this,"isConnected",!1);this.numberOfBUttons=i,this.axes.push(0,0),window.addEventListener("gamepadconnected",e=>this.onGamePadConnected(e)),window.addEventListener("gamepaddisconnected",()=>this.onGamePadDisConnected()),this.update()}get Left(){return this.axes[0]==-1}get Right(){return this.axes[0]==1}get Up(){return this.axes[1]==-1}get Down(){return this.axes[1]==1}onGamePadConnected(i){this.DEBUG&&console.log("Game pad connected"),this.previousGamepad=i.gamepad,this.isConnected=!0}onGamePadDisConnected(){this.DEBUG&&console.log("Game pad disconnected"),this.isConnected=!1}update(){if(this.isConnected){let i=navigator.getGamepads();if(!i)return;let e=i[0];if(e){for(let t=0;t<this.numberOfBUttons;t++)this.buttonPressed(e.buttons[t])&&!this.buttonPressed(this.previousGamepad.buttons[t])&&document.dispatchEvent(new Event("button"+t)),Math.abs(e.axes[0])>.9&&Math.abs(this.previousGamepad.axes[0])<.9&&(this.previousGamepad=e,document.dispatchEvent(new CustomEvent("cursorX",{detail:Math.round(e.axes[0])}))),Math.abs(e.axes[1])>.9&&Math.abs(this.previousGamepad.axes[1])<.9&&(this.previousGamepad=e,document.dispatchEvent(new CustomEvent("cursorY",{detail:Math.round(e.axes[1])})));this.axes=[Math.round(e.axes[0]),Math.round(e.axes[1])],this.previousGamepad=e}}}buttonPressed(i){return typeof i=="object"?i.pressed:i==1}}class d extends HTMLElement{constructor(e){super();a(this,"selection",{x:0,y:0});a(this,"page",0);a(this,"numpages",1);a(this,"data");a(this,"cartsPerPage",12);a(this,"gameloading",!1);this.page=0,this.data=e,this.cartsPerPage=12,this.numpages=Math.ceil(this.data.length/this.cartsPerPage),this.generateGamePage(0),this.addEventListener("animationend",()=>this.classList.remove("leftAnimation","rightAnimation")),document.addEventListener("pagingSelected",t=>{let s=t.detail,n=s>this.page?1:-1;s==0&&this.page==this.numpages-1&&(n=1),s==this.numpages-1&&this.page==0&&(n=-1),this.page=s,this.generateGamePage(n)}),this.classList.add("leftAnimation"),this.updateCursor()}generateGamePage(e){this.page<0&&(this.page=this.numpages-1),this.page>=this.numpages&&(this.page=0),this.page=Math.min(Math.max(this.page,0),this.numpages-1),this.innerHTML="";let t=this.page*this.cartsPerPage,s=Math.min(this.data.length-t,this.cartsPerPage);for(let n=t;n<t+s;n++)this.generateCoverImage(this.data[n]);e<0?this.classList.add("leftAnimation"):e>0&&this.classList.add("rightAnimation"),document.dispatchEvent(new CustomEvent("gamePageSelected",{detail:this.page}))}allowRowChange(e){return this.selection.y+e>2?!0:(this.selectRow(e),!1)}selectRow(e){this.selection.y=l(this.selection.y+e,0,2)}selectColumn(e){this.selection.x+=e,this.selection.x<0&&(this.page--,this.generateGamePage(-1),this.selection=this.getLastCartPosition()),this.selection.x>3&&(this.page++,this.generateGamePage(1),this.selection.x=0,this.selection.y=0)}getLastCartPosition(){let t=(this.page+1)*this.cartsPerPage>=this.data.length?this.data.length%this.cartsPerPage:this.cartsPerPage,s=Math.floor((t-1)/4);return{x:(t-1)%4,y:s}}updateCursor(){let e=this.getSelectedElement();e&&e.classList.add("cursor")}clearCursor(){let e=this.getSelectedElement();e&&e.classList.remove("cursor")}getSelectedElement(){let e=this.selection.x+this.selection.y*4;return this.children[e]}buttonPressed(){if(this.gameloading)return;let e=this.getSelectedElement();e&&e.classList.add("chosengame"),e.addEventListener("animationend",()=>{let t=this.selection.x+this.selection.y*4+this.page*this.cartsPerPage;window.location.href=this.data[t].url}),this.gameloading=!0}generateCoverImage(e){let t=document.createElement("div");this.append(t);let s=e.cover;s&&s!=""?(t.style.backgroundImage=`url(./covers/${s})`,t.style.filter="saturate(0.8)"):(t.style.filter=`hue-rotate(${Math.floor(Math.random()*360)}deg) saturate(0.8)`,t.style.backgroundImage=e.makecode?"url(./images/cart-makecode.png)":"url(./images/cart.png)",t.innerHTML=e.name,e.makecode?t.classList.add("makecode"):t.classList.add("cartridge"))}}class c extends HTMLElement{constructor(e){super();a(this,"selection",0);let t=Math.ceil(e/12);for(let s=0;s<t;s++){const n=document.createElement("div");n.innerHTML=(s+1).toString(),this.append(n)}this.showPageNumber(),document.addEventListener("gamePageSelected",s=>{this.selection=s.detail,this.showPageNumber()})}allowRowChange(e){return!0}selectColumn(e){this.selection+=e,this.selection<0&&(this.selection=this.children.length-1),this.selection>=this.children.length&&(this.selection=0),document.dispatchEvent(new CustomEvent("pagingSelected",{detail:this.selection}))}updateCursor(){this.children[this.selection].classList.add("cursor")}clearCursor(){this.children[this.selection].classList.remove("cursor")}showPageNumber(){for(let e of this.children)e.classList.remove("selected");this.children[this.selection].classList.add("selected")}buttonPressed(){}}class h extends HTMLElement{constructor(){super();a(this,"selection",0);a(this,"allowSound",!0);a(this,"audio");const e=["🔈: ON","Add your own game!","About CMGT"];for(let t of e){const s=document.createElement("div");s.innerHTML=t,this.append(s)}this.allowSound=localStorage.getItem("sound")=="true",this.audio=new Audio,this.updateAudio()}allowRowChange(e){return!0}selectColumn(e){this.selection=l(this.selection+e,0,this.children.length-1)}updateCursor(){this.children[this.selection].classList.add("cursor")}clearCursor(){this.children[this.selection].classList.remove("cursor")}buttonPressed(){switch(this.selection){case 0:this.toggleSound();break;case 1:window.location.href="./pages/addgame.html";break}}toggleSound(){this.allowSound=!this.allowSound,localStorage.setItem("sound",String(this.allowSound)),this.updateAudio()}updateAudio(){if(this.allowSound){this.audio.src="./sound/bgmusic.mp3";let e=this.audio.play();e!==void 0&&e.then(t=>{}).catch(t=>{console.error("AUDIO FOUT "+t),this.toggleSound()})}else this.audio.pause();this.children[0].innerHTML=this.allowSound?"🔊:ON":"🔇:OFF"}}class p extends HTMLElement{constructor(){super();a(this,"selectedRow",0);a(this,"joystick");a(this,"menus");fetch("./data/games.json").then(e=>e.json()).then(e=>this.initApp(e)).catch(e=>console.log(e))}initApp(e){this.joystick=new g(2),document.addEventListener("cursorX",t=>this.userSelectedColumn(t.detail)),document.addEventListener("cursorY",t=>this.userSelectedRow(t.detail)),document.addEventListener("button0",()=>this.getSelectedMenu().buttonPressed()),document.addEventListener("keydown",t=>this.onKeyDown(t)),this.createNavigation(e),this.update(),setInterval(()=>this.classList.add("monitorEffect"),4e4),this.classList.add("monitorEffect"),this.addEventListener("animationend",()=>this.classList.remove("monitorEffect"))}createNavigation(e){this.selectedRow=0,this.menus=[new d(e),new c(e.length),new h];for(let t of this.menus)this.append(t)}userSelectedRow(e){this.getSelectedMenu().clearCursor(),this.getSelectedMenu().allowRowChange(e)&&(this.selectedRow=l(this.selectedRow+e,0,this.menus.length-1)),this.getSelectedMenu().updateCursor()}userSelectedColumn(e){this.getSelectedMenu().clearCursor(),this.getSelectedMenu().selectColumn(e),this.getSelectedMenu().updateCursor()}getSelectedMenu(){return this.menus[this.selectedRow]}onKeyDown(e){(e.key==="ArrowRight"||e.key.toLowerCase()==="d")&&this.userSelectedColumn(1),(e.key==="ArrowLeft"||e.key.toLowerCase()==="a")&&this.userSelectedColumn(-1),(e.key==="ArrowDown"||e.key.toLowerCase()==="s")&&this.userSelectedRow(1),(e.key==="ArrowUp"||e.key.toLowerCase()==="w")&&this.userSelectedRow(-1),(e.key==="Enter"||e.key.toLowerCase()==="e"||e.key.toLowerCase()===" ")&&this.getSelectedMenu().buttonPressed()}update(){this.joystick.update(),requestAnimationFrame(()=>this.update())}}customElements.define("main-application",p);customElements.define("game-grid",d);customElements.define("page-menu",c);customElements.define("credits-menu",h);
