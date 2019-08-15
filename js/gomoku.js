class Gomoku {
  constructor (){
    this.canvas= document.querySelector("canvas");
    this.ctx= this.canvas.getContext("2d");
    this.ctx.textAlign= "center";
    this.ctx.textBaseline= "middle";
    this.ctx.font= "16px sans-serif";
    let min= Math.min(window.innerWidth, window.innerHeight);
    this.canvas.width= this.W= min/100*85;
    this.canvas.height= this.H= min/100*85;
    this.space= this.W/100*4;
    this.block= this.W/100*92/14;
    this.stone= this.block/100*40;

    this.player=[ new Player(true), new Player(false) ];
    this.turn= false;
    this.tg= this.player[+this.turn];
    this.list= [];
    
    this.eve();
    setInterval(e =>{
      this.render();
    }, 1000/30);
  }
  onClick (e){
    let Cpos= {
      x: e.pageX - e.target.offsetLeft-this.space,
      y: e.pageY - e.target.offsetTop-this.space
    };
    let Spos= {};
    for(let i= 0; i<15; i++){
      if(i*this.block-this.stone <= Cpos.x && Cpos.x <= i*this.block+this.stone){
        Spos.x= i;
        break;
      }
    }
    for(let i= 0; i<15; i++){
      if(i*this.block-this.stone <= Cpos.y && Cpos.y <= i*this.block+this.stone){
        Spos.y= i;
        break;
      }
    }
    if(this.list.includes(Spos.x+Spos.y*15)) return console.log('already');

    if((Spos.x!=null && Spos.y!=null) && (Math.hypot(Cpos.x-Spos.x*this.block, Cpos.y-Spos.y*this.block)<this.stone)){
      console.log('ok');
      if(this.tg.prov && this.tg.prov == Spos.x+Spos.y*15){
        this.list.push(Spos.x+Spos.y*15);
        this.tg.items.push(Spos.x+Spos.y*15);
        this.tg.prov= null;
        this.turn= !this.turn;
        this.tg= this.player[+this.turn];
        return;
      }
      console.log(Spos.x+Spos.y*15);
      this.player[+this.turn].prov= Spos.x+Spos.y*15;
    }
  }
  onKeyup (e){ 
    switch(e.keyCode){
      case 32:
        let item= this.player[+this.turn].prov;
        this.list.push(item);
        this.tg.items.push(item);
        this.tg.prov= null;
        this.turn= !this.turn;
        this.tg= this.player[+this.turn];
        break;
      case 37:
        if(this.player[+this.turn].prov-1 >= 0 && this.list.find(f => f == this.player[+this.turn].prov-1) == null) this.player[+this.turn].prov--;
        break;
      case 38:
        if(this.player[+this.turn].prov-15 >= 0 && this.list.find(f => f == this.player[+this.turn].prov-15) == null) this.player[+this.turn].prov-=15;
        break;
      case 39:
        if(this.player[+this.turn].prov+1 <= 224 && this.list.find(f => f == this.player[+this.turn].prov+1) == null) this.player[+this.turn].prov++;
        break;
      case 40:
        if(this.player[+this.turn].prov+15 <= 224 && this.list.find(f => f == this.player[+this.turn].prov+15) == null) this.player[+this.turn].prov+= 15;
        break;
    }
  }
  eve (){
    this.canvas.addEventListener("click", this.onClick.bind(this));
    window.addEventListener("resize", e =>{
      let min= Math.min(window.innerWidth, window.innerHeight);
      this.canvas.width= this.W= min/100*85;
      this.canvas.height= this.H= min/100*85;
      this.space= this.W/100*4;
      this.block= this.W/100*92/14;
      this.stone= this.block/100*40;
    });
    window.addEventListener("keyup", this.onKeyup.bind(this));
  }
  render (){
    this.ctx.clearRect(0, 0, this.W, this.H);
    this.ctx.fillStyle= "#dcb35b";
    this.ctx.fillRect(0, 0, this.W, this.H);
    this.ctx.lineWidth= 2;
    for(let i= 0; i<15; i++){
      this.ctx.beginPath();
      this.ctx.moveTo(this.space+this.block*i, this.space);
      this.ctx.lineTo(this.space+this.block*i, this.H-this.space);
      this.ctx.stroke();
    }
    for(let i= 0; i<15; i++){
      this.ctx.beginPath();
      this.ctx.moveTo(this.space, this.space+this.block*i);
      this.ctx.lineTo(this.W-this.space, this.space+this.block*i);
      this.ctx.stroke();
    }
    this.player.forEach(v =>{
      v.render(this.ctx, this);
    });
  }
}
class Player {
  constructor (isBlack){
     this.items= [];
     this.isBlack= isBlack;
     this.color= isBlack? "rgb(0, 0, 0)": "rgb(255, 255, 255)";
     this.prov_c= this.color.replace(/rgb\((.+)\)/, "rgba($1, 0.7)");
  }
  render (ctx, gomoku){
    if(this.prov != null){
      ctx.beginPath();
      ctx.save();
      ctx.fillStyle= this.prov_c;
      ctx.arc(gomoku.space+this.prov%15*gomoku.block, gomoku.space+Math.floor(this.prov/15)*gomoku.block, gomoku.stone, Math.PI*2, 0, false);
      ctx.fill();
      ctx.restore();
    }
    this.items.forEach(v =>{
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle= this.color;
      ctx.arc(v%15*gomoku.block+gomoku.space, Math.floor(v/15)*gomoku.block+gomoku.space, gomoku.stone, Math.PI*2, 0, false);
      ctx.fill();
    });
  }
}
window.onload= e =>{
  new Gomoku();
}