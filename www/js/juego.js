var app={
  game: null,
  colorNormal: '#f27d0c',
  colorTocando: '#ff0000',

  inicio: function(){
    DIAMETRO_BOLA = 50;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    hayColision = false;
  
    colorNormalInicialR = parseInt('f2', 16);
    colorNormalInicialG = parseInt('7d', 16);
    colorNormalInicialB = parseInt('0c', 16);
    colorNormalR = colorNormalInicialR;
    colorNormalG = colorNormalInicialG;
    colorNormalB = colorNormalInicialB;
    app.componeColor(0);

    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
  },

 componeColor: function(incremento) {
    colorNormalR += incremento;
    if (colorNormalR > 255 ) { colorNormalR = 255; }
    if (colorNormalR < colorNormalInicialR ) { colorNormalR = colorNormalInicialR; }

    colorNormalG += incremento;
    if (colorNormalG > 255 ) { colorNormalG = 255; }
    if (colorNormalG < colorNormalInicialG ) { colorNormalG = colorNormalInicialG; }

    colorNormalB += incremento;
    if (colorNormalB > 255 ) { colorNormalB = 255; }
    if (colorNormalB < colorNormalInicialB) { colorNormalB = colorNormalInicialB; }

     
    app.colorNormal = '#' + (colorNormalR * parseInt('10000', 16) + colorNormalG * parseInt('100', 16) + colorNormalB).toString(16);  
    //alert(app.colorNormal);
 },

  iniciaJuego: function(){

/* function onError() {
      console.log('onError!');
    }
  navigator.accelerometer.watchAcceleration(this.onSuccess, onError, {frequency: 1000});

  onSuccess: function(datosAceleracion){
    app.representa(datosAceleracion.x, '#valorx');
    app.representa(datosAceleracion.y, '#valory');    
    app.representa(datosAceleracion.z, '#valorz');    
    },

  representa: function(dato, elementoHTML){
    redondeo = Math.round(dato * 100) / 100;
    document.querySelector(elementoHTML).innerHTML= redondeo;
  },
*/
    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
    app.game = game;

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = app.colorNormal;
      game.load.image('bola', 'assets/bola.png');
      game.load.image('objetivo', 'assets/objetivo.png');
      game.load.image('objetivo2', 'assets/grinning.png');

    }

    function create() {
      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '100px', fill: '#757676' });
      nivelText = game.add.text(16, alto - 32, 'Nivel ' + dificultad, { fontSize: '25px', fill: '#757676' });
      
      objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
      objetivo2 = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo2');
      bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
      
      game.physics.arcade.enable(bola);
      game.physics.arcade.enable(objetivo);
      game.physics.arcade.enable(objetivo2);

      bola.body.collideWorldBounds = true;
      bola.body.onWorldBounds = new Phaser.Signal();
      bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
    }

    function update(){
      app.colorFondoJuego(); 

      var factorDificultad = (300 + (dificultad * 100));
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      
      game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion1, null, this);
      game.physics.arcade.overlap(bola, objetivo2, app.incrementaPuntuacion10, null, this);
    }
  },

  colorFondoJuego: function () {
      if (hayColision === true) {
        app.game.stage.backgroundColor = app.colorTocando;    
      } else {
        app.game.stage.backgroundColor = app.colorNormal;    
      }
  },

  decrementaPuntuacion: function(){
    hayColision = true;
    puntuacion = puntuacion-1;
    scoreText.text = puntuacion;

     if (dificultad > 0){
      dificultad = dificultad - 1;
      nivelText.text = 'Nivel ' + dificultad;
      app.componeColor(-10);
    }
  },

  incrementaPuntuacion1: function(){
    puntuacion = puntuacion+1;
    scoreText.text = puntuacion;

    objetivo.body.x = app.inicioX();
    objetivo.body.y = app.inicioY();

    if (puntuacion > 0){
      dificultad = dificultad + 1;
      nivelText.text = 'Nivel ' + dificultad;
      app.componeColor(5);
    }
  },

  incrementaPuntuacion10: function(){
    puntuacion = puntuacion+10;
    scoreText.text = puntuacion;

    objetivo2.body.x = app.inicioX();
    objetivo2.body.y = app.inicioY();

    if (puntuacion > 0){
      dificultad = dificultad + 1;
      nivelText.text = 'Nivel ' + dificultad;
      app.componeColor(10);
    }
  },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA );
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      /* console.log('agitado'); */
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    hayColision = false;
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}