(function ($) {
	"use strict";

    jQuery(document).ready(function($){


var contador = 1;
var ancho = $(document).width();


    $('.menu-toggle').click(function(){
        // $('nav').toggle(); Forma Sencilla de aparecer y desaparecer
        
        if (contador == 1){
            $('nav').animate({
                left: '0'
            });
            contador = 0;
        } else {
            contador = 1;
            $('nav').animate({
                left: '-100%'
            });
        };
        
    });



    });


    jQuery(window).load(function(){


    });


}(jQuery));	