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
            const index = Math.floor(Math.random() * linguagem.length)
            resolve(linguagem[index].toLowerCase())
        })
    }



    function iniciar() { 
    lp(aleatorio, linguagens)("/*", "*/").
		    then(resp => {
                     $('.pgL.text-tertiary').text(resp)
                     setTimeout(iniciar, 900)})
       }

    iniciar()
})
