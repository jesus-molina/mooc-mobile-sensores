var app={
  inicio: function(){
    DIAMETRO_BOLA = 50;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
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
    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = '#f27d0c';
      game.load.image('bola', 'assets/bola.png');
    }

    function create() {
      bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
      game.physics.arcade.enable(bola);
    }

    function update(){
      bola.body.velocity.y = (velocidadY * 300);
      bola.body.velocity.x = (velocidadX * (-1 * 300));
    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  decrementaPuntuacion: function(){
    puntuacion = puntuacion-1;
    scoreText.text = puntuacion;
  },

  incrementaPuntuacion: function(){
    puntuacion = puntuacion+1;
    scoreText.text = puntuacion;
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
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}