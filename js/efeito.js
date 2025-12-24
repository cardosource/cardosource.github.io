class GlitchEffectsManager {
    constructor(projeto, cardSelector = null, indiceInicial = 0) {
        this.projeto = projeto;
        this.indiceAtual = indiceInicial;
        this.effects = [];
        this.timer = null;
        this.cardSelector = cardSelector;
        this.initializeEffects();
    }

    initializeEffects() {
        this.effects.push({
            name: 'numeroX',
            selector: '.block.text-tertiary',
            execute: this.efeitoComXRapido.bind(this),
            setInitialText: (elemento) => {
                if (elemento && this.projeto.bloc && this.projeto.bloc[this.indiceAtual]) {
                    const partes = elemento.textContent.split(': ');
                    const prefixo = partes[0] + ': ';
                    elemento.textContent = prefixo + this.projeto.bloc[this.indiceAtual];
                }
            }
        });

        this.effects.push({
            name: 'trocaLetras',
            selector: '.name.text-3xl.text-tertiary.font-bold.tracking-widest.leading-none',
            execute: this.efeitoTrocaLetrasRapido.bind(this),
            setInitialText: (elemento) => {
                if (elemento && this.projeto.projeto && this.projeto.projeto[this.indiceAtual]) {
                    elemento.textContent = "0x5B  " + this.projeto.projeto[this.indiceAtual];
                }
            }
        });

        this.effects.push({
            name: 'glitchTexto',
            selector: '.info_proj',
            execute: this.efeitoGlitchTexto.bind(this),
            delay: 2000,
            setInitialText: (elemento) => {
                if (elemento && this.projeto.texto && this.projeto.texto[this.indiceAtual]) {
                    elemento.innerHTML = this.projeto.texto[this.indiceAtual];
                }
            }
        });

        this.effects.push({
            name: 'lingGlitch',
            selector: '.name_is.text-lg.text-tertiary.font-bold.leading-none',
            execute: this.efeitoLINGGlitch.bind(this),
            setInitialText: (elemento) => {
                if (elemento && this.projeto.tipo && this.projeto.tipo[this.indiceAtual]) {
                    elemento.textContent = this.projeto.tipo[this.indiceAtual];
                }
            }
        });
     this.effects.push({
            name: 'mitRotacao',
            selector: '.linc',
            execute: this.efeitoMITRotacao.bind(this),
            setInitialText: (elemento) => {
                if (elemento && elemento.childNodes[0] && this.projeto.linc) {
                    elemento.childNodes[0].nodeValue = this.projeto.linc[this.indiceAtual] + " ";
                }
            }
        });

        this.effects.push({
            name: 'atualizarURL',
            selector: '.repo.text-sm.tracking-\\[0\\.2em\\].flex.items-center',
            execute: this.atualizarGithubURL.bind(this),
            setInitialText: (elemento) => {
                this.adicionarTextoURL(elemento, true);
            }
        });
    }

    queryCardElement(selector) {
        if (this.cardSelector) {
            const card = document.querySelector(this.cardSelector);
            if (card) {
                return card.querySelector(selector);
            }
        }
        return document.querySelector(selector);
    }

    adicionarTextoURL(elemento, apenasAplicar = false) {
        if (!elemento || !this.projeto.url || !this.projeto.url[this.indiceAtual]) return;
        
        let temTexto = false;
        for (let node of elemento.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                temTexto = true;
                node.textContent = this.projeto.url[this.indiceAtual] + ' ';
                break;
            }
        }
        
        if (!temTexto) {
            const textNode = document.createTextNode(this.projeto.url[this.indiceAtual] + ' ');
            elemento.insertBefore(textNode, elemento.firstChild);
        }
        
        if (apenasAplicar) return;
    }

    proximoProjeto() {
        const maxIndice = Math.max(
            this.projeto.bloc ? this.projeto.bloc.length - 1 : 0,
            this.projeto.projeto ? this.projeto.projeto.length - 1 : 0,
            this.projeto.tipo ? this.projeto.tipo.length - 1 : 0,
            this.projeto.texto ? this.projeto.texto.length - 1 : 0,
            this.projeto.linc ? this.projeto.linc.length - 1 : 0,
            this.projeto.url ? this.projeto.url.length - 1 : 0
        );
        
        this.indiceAtual = (this.indiceAtual + 1) % (maxIndice + 1);
        
        this.aplicarTextosFixos();
        this.reexecutarEfeitos();
        
    }

    setIndice(indice) {
        const maxIndice = Math.max(
            this.projeto.bloc ? this.projeto.bloc.length - 1 : 0,
            this.projeto.projeto ? this.projeto.projeto.length - 1 : 0,
            this.projeto.tipo ? this.projeto.tipo.length - 1 : 0,
            this.projeto.texto ? this.projeto.texto.length - 1 : 0,
            this.projeto.linc ? this.projeto.linc.length - 1 : 0,
            this.projeto.url ? this.projeto.url.length - 1 : 0
        );
        
        if (indice >= 0 && indice <= maxIndice) {
            this.indiceAtual = indice;
            this.aplicarTextosFixos();
            this.reexecutarEfeitos();
        }
    }

    iniciarRotacaoAutomatica(intervaloMinutos = 1) {
        const intervaloMs = intervaloMinutos * 60 * 1000;
        
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.timer = setInterval(() => {
            this.proximoProjeto();
       }, intervaloMs);
        
       }

    pararRotacaoAutomatica() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            console.log('Rotação automática parada');
        }
    }

    reexecutarEfeitos() {
        this.effects.forEach(effect => {
            if (effect.name === 'glitchTexto') {
                const elemento = this.queryCardElement(effect.selector);
                if (elemento) effect.execute(elemento);
            } else if (effect.name !== 'atualizarURL') {
                const elemento = this.queryCardElement(effect.selector);
                if (elemento && effect.execute) {
                    effect.execute(elemento);
                }
            }
        });
    }

    aplicarTextosFixos() {
        this.effects.forEach(effect => {
            const elemento = this.queryCardElement(effect.selector);
            if (elemento && effect.setInitialText) {
                effect.setInitialText(elemento);
            }
        });
    }

    efeitoComXRapido() {
        const elemento = this.queryCardElement('.block.text-tertiary');
        if (!elemento || !this.projeto.bloc || !this.projeto.bloc[this.indiceAtual]) return;
        
        const textoOriginal = elemento.textContent;
        const partes = textoOriginal.split(': ');
        const prefixo = partes[0] + ': ';
        const textoFinalSalvo = elemento.textContent;
        
        let contador = 0;
        const totalAtualizacoes = 80;
        
        const intervalo = setInterval(() => {
            contador++;
            
            if (contador < 60 && contador % 3 === 0) {
                elemento.textContent = prefixo + 'XXXXXX/XX/XX';
            } else {
                const num1 = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
                const num2 = Math.floor(Math.random() * 100).toString().padStart(2, '0');
                const num3 = Math.floor(Math.random() * 100).toString().padStart(2, '0');
                elemento.textContent = prefixo + `${num1}/${num2}/${num3}`;
            }
            
            if (contador >= totalAtualizacoes) {
                clearInterval(intervalo);
                elemento.textContent = textoFinalSalvo;
            }
        }, 30);
    }

    efeitoTrocaLetrasRapido() {
        const elemento = this.queryCardElement('.name.text-3xl.text-tertiary.font-bold.tracking-widest.leading-none');
        if (!elemento || !this.projeto.projeto || !this.projeto.projeto[this.indiceAtual]) return;
        
        const textoFinalSalvo = elemento.textContent;
        const textoFinal = "0x5B  " + this.projeto.projeto[this.indiceAtual];
        const caracteres = textoFinal.split('');
        let contador = 0;
        const totalCiclos = 150;
        
        const embaralharRapidamente = () => {
            contador++;
            
            if (contador <= totalCiclos) {
                let embaralhado = [...caracteres];
                
                for (let i = 0; i < embaralhado.length; i++) {
                    if (embaralhado[i] !== 'x' && Math.random() > 0.5) {
                        const j = Math.floor(Math.random() * embaralhado.length);
                        if (embaralhado[j] !== 'x') {
                            [embaralhado[i], embaralhado[j]] = [embaralhado[j], embaralhado[i]];
                        }
                    }
                }
                
                elemento.textContent = embaralhado.join('');
                
                const velocidade = contador < 100 ? 20 : contador < 130 ? 40 : 80;                        
                setTimeout(embaralharRapidamente, velocidade);
            } else {
                elemento.textContent = textoFinalSalvo;
            }
        };
        
        embaralharRapidamente();
    }

    efeitoGlitchTexto() {
        const elemento = this.queryCardElement('.info_proj');
        if (!elemento || !this.projeto.texto || !this.projeto.texto[this.indiceAtual]) return;
        
        const textoFinalSalvo = elemento.innerHTML;
        const textoLimpo = textoFinalSalvo.replace(/<br>/gi, '\n');
        let ciclo = 0;
        const totalCiclos = 150;
        
        const glitch = () => {
            ciclo++;            
            if (ciclo < 100) {
                let glitchText = '';
                for (let i = 0; i < textoLimpo.length; i++) {
                    const char = textoLimpo[i];
                    
                    if (char === '\n') {
                        glitchText += '<br>';
                    } else if (char === ' ') {
                        glitchText += ' ';
                    } else if (Math.random() > (ciclo / 200)) {
                        const glitchChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
                        glitchText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    } else {
                        glitchText += char;
                    }
                }
                
                elemento.innerHTML = glitchText;
                setTimeout(glitch, 20);
            } else if (ciclo < 130) {
                let parcial = '';
                const progresso = (ciclo - 100) / 30;
                
                for (let i = 0; i < textoLimpo.length; i++) {
                    if (Math.random() > progresso) {
                        const glitchChars = 'abcdefghijklmnopqrstuvwxyz';
                        parcial += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    } else {
                        parcial += textoLimpo[i];
                    }
                }
                
                elemento.innerHTML = parcial.replace(/\n/g, '<br>');
                setTimeout(glitch, 30);
            } else {
                elemento.innerHTML = textoFinalSalvo;
            }
        };
        
        setTimeout(glitch, 2000);
    }

    efeitoLINGGlitch() {
        const elemento = this.queryCardElement('.name_is.text-lg.text-tertiary.font-bold.leading-none');
        if (!elemento || !this.projeto.tipo || !this.projeto.tipo[this.indiceAtual]) return;
        
        const textoFinalSalvo = elemento.textContent;
        const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let ciclo = 0;
        const totalCiclos = 100;
        
        const glitchLetras = () => {
            ciclo++;
            
            if (ciclo < 70) {
                let glitchText = "";
                for (let i = 0; i < textoFinalSalvo.length; i++) {
                    if (Math.random() > 0.3) {
                        glitchText += letras[Math.floor(Math.random() * letras.length)];
                    } else {
                        glitchText += textoFinalSalvo[i];
                    }
                }
                
                elemento.textContent = glitchText;
                setTimeout(glitchLetras, 20);
            } else if (ciclo < 90) {
                let parcial = "";
                const progresso = (ciclo - 70) / 20;
                
                for (let i = 0; i < textoFinalSalvo.length; i++) {
                    if (Math.random() > progresso) {
                        parcial += letras[Math.floor(Math.random() * letras.length)];
                    } else {
                        parcial += textoFinalSalvo[i];
                    }
                }
                
                elemento.textContent = parcial;
                setTimeout(glitchLetras, 30);
            } else {
                elemento.textContent = textoFinalSalvo;
            }
        };
        
        glitchLetras();
    }

    efeitoMITRotacao() {
        const elemento = this.queryCardElement('.linc');
        if (!elemento || !elemento.childNodes[0] || !this.projeto.linc) return;
        
        const textoFinalSalvo = elemento.childNodes[0].nodeValue;
        let contador = 0;
        const totalCiclos = 120;
        
        const siglasLicencas = [
            "GPL", "BSD", "APL", "MPL", "EPL", "LGPL", "AGPL", "MIT", "ISC", "Apache",
            "UNI", "PUB", "OSS", "FOS", "OPN", "SRC", "COD", "LIB", "API", "SDK",
            "GNU", "WTF", "CC0", "ART", "ZLI", "CPL", "CDD", "ECL", "OSL", "QPL"
        ];
        
        const intervalo = setInterval(() => {
            contador++;
            
            if (contador < 80) {
                const randomIndex = Math.floor(Math.random() * siglasLicencas.length);
                elemento.childNodes[0].nodeValue = siglasLicencas[randomIndex] + " ";
            } else if (contador < 100) {
                if (contador % 3 === 0) {
                    elemento.childNodes[0].nodeValue = this.projeto.linc[this.indiceAtual] + " ";
                } else {
                    const parecidas = [this.projeto.linc[this.indiceAtual]];
                    const chars = this.projeto.linc[this.indiceAtual].split('');
                    for (let i = 0; i < chars.length; i++) {
                        if (Math.random() > 0.5) {
                            const variavel = [...chars];
                            const substituicoes = ['1', '!', '|', 'I', 'L', '7'];
                            variavel[i] = substituicoes[Math.floor(Math.random() * substituicoes.length)];
                            parecidas.push(variavel.join(''));
                        }
                    }
                    elemento.childNodes[0].nodeValue = parecidas[Math.floor(Math.random() * parecidas.length)] + " ";
                }
            } else {
                clearInterval(intervalo);
                elemento.childNodes[0].nodeValue = textoFinalSalvo;
            }
        }, 25);
    }

    atualizarGithubURL() {
        const elemento = this.queryCardElement('.repo.text-sm.tracking-\\[0\\.2em\\].flex.items-center');
        if (!elemento || !this.projeto.url || !this.projeto.url[this.indiceAtual]) return;
        
        this.adicionarTextoURL(elemento, true);
    }

    applyEffects() {
        this.aplicarTextosFixos();
        
        this.effects.forEach(effect => {
            if (effect.name === 'glitchTexto') {
                const elemento = this.queryCardElement(effect.selector);
                if (elemento) effect.execute(elemento);
            } else if (effect.name !== 'atualizarURL') {
                const elemento = this.queryCardElement(effect.selector);
                if (elemento && effect.execute) {
                    effect.execute(elemento);
                }
            }
        });
    }

    startAllEffects(iniciarRotacao = true) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.applyEffects();
                if (iniciarRotacao) {
                    this.iniciarRotacaoAutomatica(1);
                }
            });
        } else {
            this.applyEffects();
            if (iniciarRotacao) {
                this.iniciarRotacaoAutomatica(1);
            }
        }
    }
}




class CardsSyncManager {
    constructor() {
        this.cards = [];
        this.timer = null;
    }

    addCard(manager, cardId) {
        this.cards.push({ manager, id: cardId });
    }

    garantirIndicesDiferentes() {
        const indicesUsados = new Set();
        const duplicados = [];   
        this.cards.forEach(card => {
            if (indicesUsados.has(card.manager.indiceAtual)) {
                duplicados.push(card);
            } else {
                indicesUsados.add(card.manager.indiceAtual);
            }
        });
        if (duplicados.length > 0) {
            const totalProjetos = Math.max(
                ...this.cards.map(card => {
                    const projeto = card.manager.projeto;
                    return Math.max(
                        projeto.bloc ? projeto.bloc.length : 0,
                        projeto.projeto ? projeto.projeto.length : 0,
                        projeto.texto ? projeto.texto.length : 0
                    );
                })
            );

            duplicados.forEach(card => {
                let novoIndice;
                let tentativas = 0;
                
                do {
                    novoIndice = Math.floor(Math.random() * totalProjetos);
                    tentativas++;
                } while (indicesUsados.has(novoIndice) && tentativas < 20);
                
                if (tentativas < 20) {
                    card.manager.setIndice(novoIndice);
                    indicesUsados.add(novoIndice);
                }
            });
        }
    }

    proximoTodos() {
        this.cards.forEach(card => {
            card.manager.proximoProjeto();
        });
        
        setTimeout(() => this.garantirIndicesDiferentes(), 100);
    }

    iniciarRotacaoSincronizada(intervaloMinutos = 1) {
        const intervaloMs = intervaloMinutos * 60 * 1000;
        if (this.timer) {
            clearInterval(this.timer);
        }        
        this.garantirIndicesDiferentes();
        this.timer = setInterval(() => {
            this.proximoTodos();
        }, intervaloMs);
        
    }

    pararRotacaoSincronizada() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

const projetosDisponiveis = {
    bloc: ["13456/78/29", "541116/38/11", "987654/12/34", "123456/78/90"],
    projeto: ["ProgressVertical", "su", "NFe Assistant", "myodReaktor"],
    tipo: ["biblioteca", "ling", "a.i", "ferramenta"],
    linc: ["mit","not","BSD 3-Clause","GPL-3.0"],
    texto: [
        `ProgressVertical é uma biblioteca Python<br>
          em desenvolvimento para a exibição de barras de progresso verticais em aplicações de linha de comando (CLI)`,
        
        `Simple & Unified (.su)<br>
         é uma linguagem de programação desenvolvida em C++ com foco principal em simplicidade e intuitividade.`,
        
        `NFe Assistant<br>
         assistente IA, responde perguntas sobre conteúdo do documentos fiscais`,
        
        `myodReaktor é um detector WAFs (Web Application Firewalls)<br>
         que aplica técnica de fingerprinting análise probabilística multifatorial`,
        
        
    ],
    url: [
        "github.com/cardosource/progressvertical",
        "github.com/cardosource/su",
        "github.com/cardosource/NFe-Assistant",
        "github.com/cardosource/myodReaktor",

    ]
};
const managerCard1 = new GlitchEffectsManager(projetosDisponiveis, '#card1', 0);
const managerCard2 = new GlitchEffectsManager(projetosDisponiveis, '#card2', 1);
const syncManager = new CardsSyncManager();
syncManager.addCard(managerCard1, 'card1');
syncManager.addCard(managerCard2, 'card2');

document.addEventListener('DOMContentLoaded', () => {
    managerCard1.startAllEffects(false);
    managerCard2.startAllEffects(false);  
    syncManager.iniciarRotacaoSincronizada(0.3); 
    
});

function mudarProjetoManual() {
    syncManager.proximoTodos();
}

function pararRotacao() {
    syncManager.pararRotacaoSincronizada();
    managerCard1.pararRotacaoAutomatica();
    managerCard2.pararRotacaoAutomatica();
}

function reiniciarRotacao(intervaloMinutos = 1) {
    syncManager.iniciarRotacaoSincronizada(intervaloMinutos);
}

window.GlitchManager = {
    card1: managerCard1,
    card2: managerCard2,
    sync: syncManager,
    mudarProjeto: mudarProjetoManual,
    pararRotacao: pararRotacao,
    reiniciarRotacao: reiniciarRotacao
};