(function($,wd){

    $('#home').append('<script type="text/javascript" src="//ra.revolvermaps.com/0/0/6.js?i=0n3fneuxyy8&amp;m=7&amp;c=ff0000&amp;cr1=ffffff&amp;f=arial&amp;l=0" async="async"></script>')

    $('#home').find('>.clsRevo .btn-info').click(function(){
        var idx = $(this).index()
        var n = 0
        if(idx == 0){
            n = 10
        }else if(idx == 1){
            n = -10
        }else{
            n = 'auto'
        }
        var c = $(this).parent().next()
        var cw = n != 'auto' ? parseInt(c.css('width'))+n : $('#home').height()-$(this).parent().height()
        c.stop().animate({maxWidth:cw+'px'},200)
    })

    showBigAs()

    function showBigAs(){
        setTimeout(function(){console.log($('#home').find('>.clsRevo').next())
            if($('#home').find('>.clsRevo').next().length && $('#home').find('>.clsRevo').next().height()){
                var cw = $('#home').height()-$('#home').find('>.clsRevo').height()
                $('#home').find('>.clsRevo').next().animate({maxWidth:cw+'px'},200)
            }else{
                showBigAs()
            }
        },400)
    }

})(jQuery,window)