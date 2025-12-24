$(function(){

let linguagens = ["Python", "C++", "TypeScript",  "JavaScript","fastapi"];

setInterval(_=>{$('.pgL.text-tertiary').text(_=>{
    const index = Math.floor(Math.random() * linguagens.length);
    return linguagens[index].toLocaleLowerCase();})},900)

});
