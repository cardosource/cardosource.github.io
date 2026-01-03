$(function(){

const linguagens = ["Python", "C++", "TypeScript", "JavaScript", "fastapi"]

function lp(func, params){
     return (caracter1, caracter2) => {
        return func(params).then(resultado => {
            return `${caracter1} ${resultado} ${caracter2}`
        })
     }
}

function aleatorio(linguagem){
   return new Promise(function(resolve){
       setTimeout(function(){
           const index = Math.floor(Math.random() * linguagem.length)
           resolve(linguagem[index].toLowerCase())
       }, 900)
   })
}


const mostrarLinguagem = lp(aleatorio, linguagens)

function iniciar() {
    mostrarLinguagem("/*", "*/").then(resp => {
        $('.pgL.text-tertiary').text(resp)
        
        setTimeout(alternarLinguagem, 2000) 
    })
}

iniciar()


});
