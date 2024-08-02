$(document).ready(function () {
    $("#popUp").css("cursor","pointer")
    $("#popUp").on("click",function () { 
        $(this).toggle()
     })
    $('#popUp').hover(function(){
        $(this).css("opacity","0.7")
    },function(){
        $(this).css("opacity","1")
    })
  })