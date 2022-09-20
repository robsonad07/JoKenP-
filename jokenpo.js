const PEDRA = "pedra";
const TESOURA = "tesoura";
const PAPEL = "papel";


class Jogador {
    constructor(nome = "npc"){
        this.nome = nome;
        this.vitorias = 0;
        this._escolha = null
    }
    get escolha(){
        return this._escolha;    
    }
    set escolha(valor){
        this._escolha = [PEDRA, TESOURA, PAPEL].includes(valor) ? valor : PEDRA
    }
}

class Game{
    constructor(){
        this.p1Vitorias = 0;
        this.npcVitorias = 0;
        this.p1 = new Jogador("Robson");
        this.npc = new Jogador();
    }

    iniciarGame(){
        this.p1Vitorias = 0;
        this.npcVitorias = 0;
    }

    escolher(opcao){
        this.p1.escolha = opcao;
    }

    npcEscolher(){
        this.npc.escolha =[PEDRA, TESOURA, PAPEL][Math.floor(Math.random() * 3)];
    }

    deuEmpate(){
        return this.p1.escolha == this.npc.escolha;
    }

    venceu(){
        if(
            (this.p1.escolha == PEDRA && this.npc.escolha == TESOURA) ||
            (this.p1.escolha == TESOURA && this.npc.escolha == PAPEL) ||
            (this.p1.escolha == PAPEL && this.npc.escolha == PEDRA)
        ){
            this.p1Vitorias++;
            return true;
        }
        this.npcVitorias++;
        return false;
    }

    acabou(){
        return Math.max(this.p1Vitorias, this.npcVitorias) > 2;
    }
}

class UI{
    constructor(game){
        this.divApresentacao = document.getElementById("apresentacao");
        this.btnComecar = document.getElementById("comecar");
        this.divPlacar = document.getElementById("placar");
        this.spanP1Score = document.getElementById("p1-score");
        this.spanNPCScore = document.getElementById("npc-score");
        this.imgP1 = document.getElementById("p1-escolha");
        this.imgNPC = document.getElementById("npc-escolha");
        this.divMensagem = document.getElementById("mensagem");
        this.btnPedra = document.getElementById("pedra");
        this.btnTesoura = document.getElementById("tesoura");
        this.btnPapel = document.getElementById("papel");

        this.game = game;

        this.btnComecar.addEventListener("click", () => this.comecar());
        this.btnPedra.addEventListener("click", () => this.escolher(PEDRA));
        this.btnPapel.addEventListener("click", () => this.escolher(PAPEL));
        this.btnTesoura.addEventListener("click", () => this.escolher(TESOURA));
    }

    comecar(){
        this.divApresentacao.setAttribute("class", "invisible");
    }

    escolher(opcao){
        this.game.escolher(opcao);
        this.game.npcEscolher();
        this.mostrarEscolhas(opcao, this.imgP1);
        this.mostrarEscolhas(this.game.npc.escolha, this.imgNPC);
        this.atualizarMensagem(`Você escolheu ${opcao}`, false);
        this.atualizarMensagem("Aguarde o adversário.");
        this.atualizarMensagem(`O adversário escolheu ${this.game.npc.escolha}`);
        this.desabilitarBotoes();

        setTimeout(() => this.atualizarPLacar(), 500);
    }

    mostrarEscolhas(escolha, player){
        player.setAttribute("src", `/img/${escolha}.png`);
        player.setAttribute("class", "visible");
    }

    atualizarMensagem(mensagem, append = true){
        if(append){
            const novaLinha = document.createElement("br");
            this.divMensagem.appendChild(novaLinha);
            this.divMensagem.appendChild(document.createTextNode(mensagem));
        
        }else{
            this.divMensagem.textContent = mensagem;
        }
        
    }

    atualizarPLacar(){
        if(this.game.deuEmpate()){
            this.divPlacar.setAttribute("class", "alert alert-secondary");
            this.atualizarMensagem("EMPATE!", false);
        }else if(this.game.venceu()){
            this.divPlacar.setAttribute("class", "alert alert-success");
            let scoreAtual = parseInt(this.spanP1Score.textContent);
            scoreAtual++;
            this.spanP1Score.textContent = scoreAtual;
            this.atualizarMensagem(" Parabens, Você venceu!", false);
        }else{
            this.divPlacar.setAttribute("class", "alert alert-danger");
            let scoreAtual = parseInt(this.spanNPCScore.textContent);
            scoreAtual++;
            this.spanNPCScore.textContent = scoreAtual;
            this.atualizarMensagem("Infelizmente, Você perdeu!", false);
        }

        setTimeout(() => {
            if(this.game.acabou()){
                if(this.game.p1Vitorias > this.game.npcVitorias){
                    this.divMensagem.setAttribute("class", "alert alert-success");
                }else{
                    this.divMensagem.setAttribute("class", "alert alert-danger");
                }
                const recomecar = document.createElement("button");
                recomecar.setAttribute("class", "btn btn-light text-dark");
                recomecar.appendChild(document.createTextNode("Recomecar"));
                recomecar.addEventListener("click", () => this.recomecar());
                this.divMensagem.appendChild(document.createElement("br"));
                this.divMensagem.appendChild(recomecar);
                this.desabilitarBotoes();
            }else{
                this.habilitarBotoes();
                this.esconderEscolhas();
                this.atualizarMensagem("É sua vez novamente", false);
                this.atualizarMensagem("Escolha uma das opcões abaixo: ")
            }
        } ,500);

        this.habilitarBotoes();
    }

    recomecar(){
        this.habilitarBotoes();
        this.zerarPlaca();
        this.reiniciarMensagem();
        this.esconderEscolhas();
        this.game.iniciarGame();
    }

    desabilitarBotoes(){
        this.btnPedra.setAttribute("disabled", "disabled");
        this.btnPapel.setAttribute("disabled", "disabled");
        this.btnTesoura.setAttribute("disabled", "disabled");
    }

    habilitarBotoes(){
        this.btnPedra.removeAttribute("disabled");
        this.btnPapel.removeAttribute("disabled");
        this.btnTesoura.removeAttribute("disabled");
    }
    
    zerarPlaca(){
        this.spanP1Score.textContent = 0;
        this.spanNPCScore.textContent = 0;
        this.divPlacar.setAttribute("class", "alert-info");
    }
    reiniciarMensagem(){
        this.divMensagem.removeAttribute("class");
        this.divMensagem.textContent = "Escolha uma das opcoes abaixo: ";
    }

    esconderEscolhas(){
        this.imgP1.removeAttribute("src");
        this.imgNPC.removeAttribute("src");
    }
}
    

window.onload = () => {
    const game = new Game();
    const ui = new UI(game);
}