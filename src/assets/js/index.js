import TweenMax from "gsap"
import MorphSVGPlugin from "./MorphSVGPlugin";
import TweenLite from "./TweenLite";

window.onload = function(){
  //======変数・関数定義======
  var resizeTimer;
  var interval = Math.floor(1000 / 60 * 10);
  var canvasWrap = document.querySelector('#canvas-container');
  var canvas = document.querySelector('#canvas');
  var center = {};
  var ctx = canvas.getContext('2d');
  var density = 10;
  var particles = [];
  var colors = ['#FF634733','#a1d78233','#f8eb3c33','#1E90FF33']
  var baseSize = 5
  var baseSpeed = 40


  var Particle = function () {
    this.size = Math.floor( Math.random() * 40 ) + baseSize;
    this.color = colors[ ~~(Math.random() * 4) ];
    this.speed = this.size / baseSpeed;
    this.position = {  
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    };
    var rot = Math.random() * 360;
    var angle = rot * Math.PI / 180;
    this.vec = {
      x: Math.cos(angle) * this.speed,
      y: Math.sin(angle) * this.speed
    };
  };

  Particle.prototype = {
    update: function(){
      this.draw();
      this.position.x += this.vec.x;
      this.position.y += this.vec.y;

      if(this.position.x > canvas.width + 50) {
        this.position.x = -50;
      } else if(this.position.x < 0 - 50) {
        this.position.x = canvas.width + 50;
      } else if(this.position.y > canvas.height + 50) {
        this.position.y = -50;
      } else if(this.position.y < 0 - 50) {
        this.position.y = canvas.height + 50;
      }
    },

    draw: function(){
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI, false);
      ctx.fill();
    },

  }

  function initParticles(){
    canvas.setAttribute("width", canvasWrap.offsetWidth);
    canvas.setAttribute("height", canvasWrap.offsetHeight);

    // canvas中央をセット
    center.x = canvas.width / 2;
    center.y = canvas.height / 2;

    for (var i = 0; i < density; i++ ){
      particles.push(new Particle())
    }
    updateParticles();
  }

  function updateParticles(){
    requestAnimationFrame(updateParticles);
    ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);

    for (var i = 0; i < density; i++){
      particles[i].update();
    }
  }


  var setWindowSize = function(){
    var w = window.innerWidth;
    var h = window.innerHeight;
    document.getElementById('canvas').setAttribute('width', w);
    document.getElementById('canvas').setAttribute('height', h);  
  }

  //======アプリケーション処理======
  initParticles()
 
  //======イベントリスナー系======
  window.addEventListener('resize', function (event) {
    if (resizeTimer !== false) {
      clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(function () {
      setWindowSize()
    }, interval);
  });

  var app = new Vue({
    el: '#app',
  
    data: {
      name: 'Vue.js',
      top: 500,
      left: 200,
      height: 20,
      width: 20
    },
    methods: {
      moveCursor: function (event) {
        this.name = event.pageX
        this.top = event.pageY - (this.height / 2)
        this.left = event.pageX - (this.width / 2)
      },
      onGreenArrow: function (event) {
        console.log("nottayo")
      }
    }
  })

  var greenArrow = new Vue({
    el: ".js-green-arrow-link",
    methods: {
      changeGreenArrow: function(event){
      }
    }
  })
  MorphSVGPlugin.convertToPath("circle, rect, polygon");

  var select = function(s) {
    return document.querySelector(s);
  }

  var ColorTimeline = function(colorName, colorValue){
    var tl = new TimelineMax({paused:true})
  
    tl.to(`#${colorName}-arrow__subject1`, 0.3, {morphSVG:`#${colorName}-arrow__top`,fill: colorValue})
      .to(`#${colorName}-arrow__subject3`, 0.3, {morphSVG:`#${colorName}-arrow__middle`,fill: colorValue}, '-=0.3')
      .to(`#${colorName}-arrow__subject2`, 0.3, {morphSVG:`#${colorName}-arrow__end`,fill: colorValue}, '-=0.3')
      .to(`#${colorName}-arrow__text`, 0.3, {opacity:0,ease:"easeInOut"}, '-=0.3')
    return tl
  }

  var colorObj = function(num){
    var objctID = ["#green-arrow-SVG","#blue-arrow-SVG","#red-arrow-SVG","#yellow-arrow-SVG"]
    var colorName = ["green","blue","red","yellow"]
    var colorValue = ["#A1D782","#1E90FF","#FF6347","#f8eb3c"]
    var translateValue = [{x:0,y:-100},{x:-100,y:-200},{x:-200,y:-100},{x:-100,y:0}]
    var obj = select(objctID[num])
    var tl = new ColorTimeline(colorName[num], colorValue[num])
  
    obj.addEventListener('mouseover', function() {
      tl.play();
    })
  
    obj.addEventListener('mouseleave', function() {
      if (tl.time() > 0){
        tl.reverse();
      }
    })

    obj.addEventListener('click', function() {
      var app = document.getElementById("app")
      app.setAttribute("style",`transform: translate(${translateValue[num].x}vw, ${translateValue[num].y}vh);`)
      document.getElementById("overlay").classList.add("active")
      document.getElementById("green-rectangle").classList.add("up")
      setTimeout(function(){
        document.getElementById("green-rectangle").classList.add("after")
      },450)
      setTimeout(function(){
        document.getElementById("green-rectangle").classList.remove("after","up")
        document.getElementById("overlay").classList.remove("active")
      },700)
    })
  }

  var redMainSVG = new colorObj(0)
  var greenMainSVG = new colorObj(1)
  var blueMainSVG = new colorObj(2)
  var yellowMainSVG = new colorObj(3)

  document.getElementById("home-button").addEventListener('click', function() {
    var app = document.getElementById("app")
    app.setAttribute("style",`transform: translate(-100vw, -100vh);`)
  })
}


