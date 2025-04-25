let linguagens = ["Python", "C++", "TypeScript", "C", "JavaScript","Jquery", "Django", "DRF"];

setInterval(_=>{$('#pgL').text(_=>{
    const index = Math.floor(Math.random() * linguagens.length);
    return linguagens[index].toLocaleLowerCase();})},300)
