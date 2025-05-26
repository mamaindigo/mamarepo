$(document).ready(function () {

    $('.dropdown__menu>a').on('click' ,function(e){
        e.preventDefault();
        if ($(window).width() < 991) {
            if ($(this).hasClass('opened')) {
                $(this).removeClass('opened');
                $(this).closest('.dropdown__menu').find('.drop').slideUp(200);                
            } else{
                $(this).addClass('opened');
                $(this).closest('.dropdown__menu').find('.drop').slideDown(200);  
            }
        }
    });

    let lastPosition = 0;
    $(window).on('scroll' ,function(e){
        
        if ($(window).scrollTop() > 3) {
            $("header").addClass("closed");
            $('header').addClass('colored');
        } else {
            $("header").removeClass("closed");
            $('header').removeClass('colored');
        }
        if (lastPosition > $(window).scrollTop()) {
            $('header').addClass('visible'); 
        } else{
            $('header').removeClass('visible');             
        }
        lastPosition = $(window).scrollTop();
    });


    $('.menu__btn>a').on('click' ,function(e){
        e.preventDefault();
        if ($(this).hasClass('opened')) {
            $(this).removeClass("opened");
            $("header .outer__header .right__part").css("top" ,"-100%");
            $('body,html').css("overflow-y" ,"initial");
        } else {
            $(this).addClass('opened');
            $('body,html').css("overflow-y" ,"hidden");
            $("header .outer__header .right__part").css("top" ,"0px");
        }
    });

    $(window).on("scroll", function () {
        let scrollTop = $(this).scrollTop();
        let start;
        if ($(window).scrollTop() >991) {
            start  = 100;
        } else {
            start = 30;
        }
        let end = 600;
        let range = end - start;

        if ($(window).width() > 480) {
            if (scrollTop >= start && scrollTop <= end) {
                let progress = (scrollTop - start) / range;
                let marginTopFirst = progress * 100;
                let marginTopSecond = progress * 200; 
                let marginTopThird = progress * 300;
                $(".btns a:nth-child(1)").css("margin-top", marginTopFirst + "px");
                $(".btns a:nth-child(2)").css("margin-top", marginTopSecond + "px");
                $(".btns a:nth-child(3)").css("margin-top", marginTopThird + "px");
            } else if (scrollTop < start) {
                $(".btns a:nth-child(1)").css("margin-top", "0px");
                $(".btns a:nth-child(2)").css("margin-top", "0px");
                $(".btns a:nth-child(3)").css("margin-top", "0px");
            } else if (scrollTop > end) {
                $(".btns a:nth-child(2)").css("margin-top", "100px");
                $(".btns a:nth-child(2)").css("margin-top", "200px");
                $(".btns a:nth-child(3)").css("margin-top", "300px");
            }
        } else {
            if (scrollTop >= start && scrollTop <= end) {
                let progress = (scrollTop - start) / range;
                let marginTopFirst = progress * 40;
                let marginTopSecond = progress * 40; 
                let marginTopThird = progress * 40;
                $(".btns a:nth-child(1)").css("margin-top", marginTopFirst + "px");
                $(".btns a:nth-child(2)").css("margin-top", marginTopSecond + "px");
                $(".btns a:nth-child(3)").css("margin-top", marginTopThird + "px");
            } else if (scrollTop < start) {
                $(".btns a:nth-child(1)").css("margin-top", "0px");
                $(".btns a:nth-child(2)").css("margin-top", "0px");
                $(".btns a:nth-child(3)").css("margin-top", "0px");
            } else if (scrollTop > end) {
                $(".btns a:nth-child(2)").css("margin-top", "40px");
                $(".btns a:nth-child(2)").css("margin-top", "40px");
                $(".btns a:nth-child(3)").css("margin-top", "40px");
            }
        }

        let statsStart = 0;
        let statsEnd = 1100;
        let statsRange = statsEnd - statsStart;
        if (scrollTop >= statsStart && scrollTop <= statsEnd) {
            let statsProgress = (scrollTop - statsStart) / statsRange;
            let translateYValue = 1300 - (statsProgress * 1300); 
            $(".stats__wrapper .outer__stats .desc").css("transform", "translateY(" + translateYValue + "px)");
        } else if (scrollTop < statsStart) {
            $(".stats__wrapper .outer__stats .desc").css("transform", "translateY(1100px)");
        } else if (scrollTop > statsEnd) {
            $(".stats__wrapper .outer__stats .desc").css("transform", "translateY(0px)");
        }
    });



    if ($('.info__wrapper').length) {
        $(window).on('scroll' ,function(){
            if ($(window).scrollTop() + $(window).height()/2 > $('.info__wrapper').offset().top) {
                $('.outer__info>.elem').each(function(index,elem){
                    if (!$(elem).hasClass('animated')) {
                        setTimeout(function(){
                            $(elem).removeClass("anim").addClass('animated');
                        }, index*200);
                    }
                });
            }
        });
    }


    if ($('.yield__wrapper').length) {
        $('.yield__wrapper .desc').addClass("animated");
        $('.yield__wrapper .info__side .el').each(function(index,elem){
            setTimeout(function(){
                $(elem).addClass("animated");
            }, 300 * (index + 1));
        });
    }

   

    if ($('.liquid__fund').length) {
        $('.liquid__fund .anim').each(function(index,elem){
            if (!$(elem).hasClass('animated')) {
                setTimeout(function(){
                    $(elem).removeClass("anim").addClass('animated');
                }, index*200);
            }
        });
    }



    if ($('.funds__plates').length) {
        $(window).on('scroll' ,function(){
            $('.funds__plates .anim').each(function(index,elem){
               if ($(window).scrollTop() + $(window).height()/1.7 > $(elem).offset().top) {
                    if (!$(elem).hasClass('animated')) {
                        setTimeout(function(){
                            $(elem).removeClass("anim").addClass('animated');
                        }, index*200);
                    }
            } 
            });
            
        });
    }



    if ($('.partners').length) {
        $(window).on('scroll', function () {
            if ($(window).scrollTop() + $(window).height() / 2 > $('.partners').offset().top) {
                $('.partners .anim').each(function (index, elem) {
                    if (!$(elem).hasClass("animated")) {
                        $(elem).addClass("animated"); 
                        setTimeout(() => {
                            $(elem).removeClass("anim").addClass('animated');
                        }, 200 * index);
                    }
                });
            }
        });
    }

    $(window).on("scroll", function () {
       if ($('.boxes.strategy').length) {
         boxes($('.boxes.strategy'));
       }
        if ($('.boxes.vision').length) {
            boxes($('.boxes.vision'));
        }
        if ($('.roadmap').length) {
            roadmapMovement();
        }
    });


    function boxes(boxes){
        let scrollTop = $(window).scrollTop();
        let $squareBoxes = $(boxes);
        let squareOffsetTop = $squareBoxes.offset().top;  
        let squareHeight = $squareBoxes.outerHeight();    

        let squareStart = squareOffsetTop - $(window).height();  
        let squareEnd = squareOffsetTop + squareHeight;        

        let squareRange = squareEnd - squareStart;

        if (scrollTop >= squareStart && scrollTop <= squareEnd) {
            let squareProgress = (scrollTop - squareStart) / squareRange;

            let squareTranslateY = squareProgress * 35; 

               $squareBoxes.find(".el").each(function(ind) {
                    let elementProgress = squareProgress * 1;
                    let elementTranslateY = elementProgress * (20 + (ind * 120)); 
                    $(this).css("transform", "translateY(" + -elementTranslateY + "px)");
                    // $(boxes).css("margin-bottom" , -elementTranslateY + "px");
                });
        } else if (scrollTop < squareStart) {
           $squareBoxes.css("transform", "translateY(0px)");
            $squareBoxes.find(".el").css("transform", "translateY(0px)");
        } else if (scrollTop > squareEnd) {
        }
    }




    function roadmapMovement(){
        let scrollTop = $(window).scrollTop();
        let $squareBoxes = $(".roadmap");
        let squareOffsetTop = $squareBoxes.offset().top;  
        let squareHeight = $squareBoxes.outerHeight();    

        let squareStart = squareOffsetTop - $(window).height();  
        let squareEnd = squareOffsetTop + squareHeight;        

        let squareRange = squareEnd - squareStart;

        if (scrollTop >= squareStart && scrollTop <= squareEnd) {
            let squareProgress = (scrollTop - squareStart) / squareRange;

            let squareTranslateY = squareProgress * 35; 

               $squareBoxes.find(".elem").each(function(ind) {
                    let elementProgress = squareProgress * 1;
                    let elementTranslateY = elementProgress * (20 + (ind * 120)); 
                    $(this).css("transform", "translateY(" + -elementTranslateY + "px)");
                    // $(boxes).css("margin-bottom" , -elementTranslateY + "px");
                });
        } else if (scrollTop < squareStart) {
           $squareBoxes.css("transform", "translateY(0px)");
            $squareBoxes.find(".el").css("transform", "translateY(0px)");
        } else if (scrollTop > squareEnd) {
        }
    }



    $(window).trigger("scroll");
});