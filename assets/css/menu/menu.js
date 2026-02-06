

document.addEventListener('DOMContentLoaded', function() {
  const menu = document.querySelector(".menu-block");
  
  // Check if menu element exists before proceeding
  if (!menu) {
    // Menu block not found - using fallback
    return;
  }
  
  const menuMain = menu.querySelector(".site-menu-main");
  const submenuAll = menu.querySelectorAll(".sub-menu");
  const goBack = menu.querySelector(".go-back");
  const menuTrigger = document.querySelector(".mobile-menu-trigger");
  const closeMenu = menu.querySelector(".mobile-menu-close");
  let subMenu;
  let subMenuArray = [];
  let subMenuTextArray = [];

 function last(array) {
    return array[array.length - 1];
}
 function last2(array) {
    return array[array.length - 2];
}


 if (menuMain) {
 menuMain.addEventListener("click", (e) =>{
    
	if(!menu.classList.contains("active")){
		return;
	}
  if(e.target.closest(".nav-item-has-children")){
       const hasChildren = e.target.closest(".nav-item-has-children");
        
      showSubMenu(hasChildren);
  }
});
 }
 if (goBack) {
 goBack.addEventListener("click",() =>{
    const lastItem = last(subMenuArray);
    const lastItemText = last2(subMenuTextArray);
    subMenuArray.pop();
    subMenuTextArray.pop();
   if(subMenuArray.length >= 0){
       document.getElementById(lastItem).style.animation = "slideRight 0.5s ease forwards";
       menu.querySelector(".current-menu-title").innerHTML = lastItemText;
       setTimeout(() =>{
           document.getElementById(lastItem).classList.remove("active");
       },300); 
   }
   if(subMenuArray.length == 0){
       menu.querySelector(".mobile-menu-head").classList.remove("active");
   }
})
 }
 if (menuTrigger) {
 menuTrigger.addEventListener("click",() =>{
	 toggleMenu();
})
 }
 if (closeMenu) {
 closeMenu.addEventListener("click",() =>{
	 toggleMenu();
})
 }
 const menuOverlay = document.querySelector(".menu-overlay");
 if (menuOverlay) {
 menuOverlay.addEventListener("click",() =>{
	toggleMenu();
})
 }
 function toggleMenu(){
 	menu.classList.toggle("active");
 	document.querySelector(".menu-overlay").classList.toggle("active");
 }
 function showSubMenu(hasChildren){
    for(let i = 0 ; submenuAll.length < i ; i++){
        submenuAll[i].classList.remove("active");
    }
    subMenu = hasChildren.querySelector(".sub-menu");
    subMenuArray.push(subMenu.id);
    subMenu.classList.add("active");
    subMenu.style.animation = "slideLeft 0.5s ease forwards";
    const menuTitle = hasChildren.querySelector(".drop-trigger").textContent;
    subMenuTextArray.push(menuTitle);
    
    menu.querySelector(".current-menu-title").innerHTML = menuTitle;
    menu.querySelector(".mobile-menu-head").classList.add("active");
 }
 window.onresize = function(){
 	if(this.innerWidth >991){
 		if(menu.classList.contains("active")){
 			toggleMenu();
 		}

 	}
 }

}); // End of DOMContentLoaded

/*-----------------------------------------------------------------------------------
    Template Name: Pixlab - Creative Agency HTML Template
    Description: Pixlab – Creative Agency HTML Template have an awesome design for a website of Agency, Web Studio, Blog, Gallery Photo, Corporate Company, Community and other. It’s the clean, modern and beautiful grid-based template.
    Author:  Wordpressriver
    Author URI: https://themeforest.net/user/wordpressriver
    Version: 1.0

    Note: This is Main Js file
-----------------------------------------------------------------------------------
    Js INDEX
    ===================
    ## Main Menu
    ## Document Ready
    ## Prealoder
    ## Sticky
    ## Back to top
    ## Counter
    ## Magnific-popup js
    ## Nice select
    ## Slick Slider
    ## Isotope JS
    ## wow JS
    ## Item Active
-----------------------------------------------------------------------------------*/

(function($) {
    'use strict';

    //===== Main Menu
    function mainMenu() {
        // Variables
        var var_window = $(window),
            navContainer = $('.header-navigation'),
            navbarToggler = $('.navbar-toggler'),
            navMenu = $('.nav-menu'),
            navMenuLi = $('.nav-menu ul li ul li'),
            closeIcon = $('.navbar-close');
        // navbar toggler
        navbarToggler.on('click', function() {
            navbarToggler.toggleClass('active');
            navMenu.toggleClass('menu-on');
        });
        // close icon
        closeIcon.on('click', function() {
            navMenu.removeClass('menu-on');
            navbarToggler.removeClass('active');
        });
        // adds toggle button to li items that have children
        navMenu.find('li a').each(function() {
            if ($(this).next().length > 0) {
                $(this).parent('li').append('<span class="dd-trigger"><i class="far fa-angle-down"></i></span>');
            }
        });
        // expands the dropdown menu on each click
        navMenu.find('li .dd-trigger').on('click', function(e) {
            e.preventDefault();
            $(this).parent('li').children('ul').stop(true, true).slideToggle(350);
            $(this).parent('li').toggleClass('active');
        });
        // check browser width in real-time
        function breakpointCheck() {
            var windoWidth = window.innerWidth;
            if (windoWidth <= 1199) {
                navContainer.addClass('breakpoint-on');
            } else {
                navContainer.removeClass('breakpoint-on');
            }
        }
        breakpointCheck();
        var_window.on('resize', function() {
            breakpointCheck();
        });
    };
    // Panel Widget
    var panelIcon = $('.bar-item'),
    panelClose = $('.panel-close,.panel-overlay'),
    panelWrap = $('.offcanvas-panel');
    panelIcon.on('click', function (e) {
        panelWrap.toggleClass('panel-on');
        e.preventDefault();
    });
    panelClose.on('click', function (e) {
        panelWrap.removeClass('panel-on');
        e.preventDefault();
    });
    // Nav Overlay On
    $(".navbar-toggler, .navbar-close,.nav-overlay").on('click', function (e) {
        $(".nav-overlay").toggleClass("active");
    });
    $(".nav-overlay").on('click', function (e) {
        $(".navbar-toggler").removeClass("active");
        $(".nav-menu").removeClass("menu-on");
    });

    // Document Ready
    $(document).ready(function() {
        mainMenu();
    });

    //===== Prealoder
    $(window).on('load', function(event) {
        $('.preloader').delay(500).fadeOut('500');
    })
    
    //===== Sticky
    $(window).on('scroll', function(event) {
        var scroll = $(window).scrollTop();
        if (scroll < 100) {
            $(".header-navigation").removeClass("sticky");
        } else {
            $(".header-navigation").addClass("sticky");
        }
    });

    //===== Back to top
    $(window).on('scroll', function(event) {
        if ($(this).scrollTop() > 600) {
            $('.back-to-top').fadeIn(200)
        } else {
            $('.back-to-top').fadeOut(200)
        }
    });
    $('.back-to-top').on('click', function(event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: 0,
        }, 1500);
    });

    //===== Counter js (counterUp library not loaded)
    // $('.count').counterUp({
    //     delay: 100,
    //     time: 4000
    // });

    //===== Magnific-popup js (guarded to avoid errors when library not loaded)
    if ($.fn && $.fn.magnificPopup) {
      $('.video-popup').magnificPopup({
          type: 'iframe',
          removalDelay: 300,
          mainClass: 'mfp-fade'
      });
      $(".img-popup").magnificPopup({
          type: "image",
           gallery: { enabled: true }
      });
    }
    //===== Nice select js (niceSelect library not loaded)
    // $('select').niceSelect();

    
    //===== Slick slider js
    
    $('.portfolio-slider-one').slick({
		dots: true,
		arrows: false,
        infinite: true,
		speed: 1500,
        autoplay: true,
		slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: '<div class="prev"><i class="far fa-angle-left"></i></div>',
		nextArrow: '<div class="next"><i class="far fa-angle-right"></i></div>',
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    arrows: false,
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 767,
                settings: {
                    arrows: false,
                    slidesToShow: 1
                }
            }
        ]
    });
    $('.testimonial-slider-one').slick({
		dots: true,
		arrows: false,
        infinite: true,
		speed: 1500,
        autoplay: true,
        vertical: true,
		slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: '<div class="prev"><i class="far fa-angle-left"></i></div>',
		nextArrow: '<div class="next"><i class="far fa-angle-right"></i></div>',
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    dots: false
                }
            }
        ]
    });
    var sliderdots= $('.testimonial-two-dots');
    $('.testimonial-slider-two').slick({
		dots: true,
		arrows: false,
        infinite: true,
		speed: 1500,
        autoplay: false,
        appendDots: sliderdots,
		slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: '<div class="prev"><i class="far fa-angle-left"></i></div>',
		nextArrow: '<div class="next"><i class="far fa-angle-right"></i></div>'
    });
    $('.testimonial-slider-three').slick({
		dots: true,
		arrows: false,
        infinite: true,
		speed: 1500,
        autoplay: true,
		slidesToShow: 2,
        slidesToScroll: 1,
        prevArrow: '<div class="prev"><i class="far fa-angle-left"></i></div>',
		nextArrow: '<div class="next"><i class="far fa-angle-right"></i></div>',
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    var sliderarrows= $('.partners-arrows');
    $('.partners-slider-one').slick({
		dots: false,
		arrows: true,
        infinite: true,
		speed: 1500,
        autoplay: true,
        appendArrows: sliderarrows,
		slidesToShow: 6,
        slidesToScroll: 1,
        prevArrow: '<div class="prev"><i class="far fa-arrow-left"></i></div>',
		nextArrow: '<div class="next"><i class="far fa-arrow-right"></i></div>',
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 4
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    //====== Isotope js (imagesLoaded and isotope libraries not loaded)
    // $('.portfolio-area').imagesLoaded( function() {
    //     // items on button click
    //     $('.filter-btn').on('click', 'li', function () {
    //         var filterValue = $(this).attr('data-filter');
    //         $grid.isotope({
    //             filter: filterValue
    //         });
    //     });
    //     // menu active class
    //     $('.filter-btn li').on('click', function (e) {
    //         $(this).siblings('.active').removeClass('active');
    //         $(this).addClass('active');
    //         e.preventDefault();
    //     });
    //     var $grid = $('.portfolio-grid').isotope({
    //         itemSelector: '.portfolio-column',
    //         layoutMode: 'fitRows'
    //     });
    // });
    // $('.masonry-portfolio').imagesLoaded( function() {
    //     // items on button click
    //     $('.filter-btn').on('click', 'li', function () {
    //         var filterValue = $(this).attr('data-filter');
    //         $grid.isotope({
    //             filter: filterValue
    //         });
    //     });
    //     // menu active class
    //     $('.filter-btn li').on('click', function (e) {
    //         $(this).siblings('.active').removeClass('active');
    //         $(this).addClass('active');
    //         e.preventDefault();
    //     });
    //     var $grid = $('.masonry-row').isotope({
     //         itemSelector: '.portfolio-column',
     //         percentPosition: true
     //     });
     // });

    //===== Wow js
    
    // new WOW().init();

    // Item Active
    $('.counter-area-v2').on('mouseover', '.counter-item', function() {
        $('.counter-item.item-active').removeClass('item-active');
        $(this).addClass('item-active');
    });

    //====== Parallax js (commented out - library not loaded)

    // $('.scene').each(function () {
    //     new Parallax($(this)[0]);
    // });
    
    // page_scroll JS

    $("a.page-scroll").on('click', function (e) {
        e.preventDefault();
        var hash = this.hash;
        var position = $(hash).offset().top - 50;
        $("html").animate({
            scrollTop : position
        },1000);
    });
    //====== Pricing tab Js

    $('.pricing-nav-tab a:last-child').click(function () {
        $(this).parent('.pricing-nav-tab').addClass('for-year');
    });
    $('.pricing-nav-tab a:first-child').click(function () {
        $(this).parent('.pricing-nav-tab').removeClass('for-year');
    });

})(window.jQuery);


// Lazy loading images with IntersectionObserver
// Lazy loading images with IntersectionObserver
document.addEventListener('DOMContentLoaded', function() {
  // Get all the images with the class "lazy"
  const lazyImages = document.querySelectorAll('.lazy');
  
  // Only set up observer if there are lazy images and IntersectionObserver is supported
  if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
    // Set up the IntersectionObserver
    const observer = new IntersectionObserver(function(entries) {
      // Loop through each entry
      entries.forEach(function(entry) {
        // Check if the entry is intersecting
        if (entry.isIntersecting) {
          // Get the image element
          const img = entry.target;
          // Set the src attribute to the data-src attribute
          if (img.getAttribute('data-src')) {
            img.setAttribute('src', img.getAttribute('data-src'));
          }
          // Remove the "lazy" class
          img.classList.remove('lazy');
          // Unobserve the entry
          observer.unobserve(img);
        }
      });
    });
    
    // Observe each lazy image
    lazyImages.forEach(img => {
      observer.observe(img);
    });
  }
});
