class Gomoku {
  constructor (){
    this.canvas= document.querySelector("canvas");
    this.ctx= this.canvas.getContext("2d");
    this.ctx.textAlign= "center";
    this.ctx.textBaseline= "middle";
    this.ctx.font= "16px sans-serif";
    this.W= this.canvas.width;
    this.H= this.canvas.height;
    this.space= 30;
    this.block= 50;
    this.stone= 18;
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
      x: e.pageX - e.target.offsetLeft-30,
      y: e.pageY - e.target.offsetTop-30
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
      this.player[+this.turn].prov= Spos.x+Spos.y*15;
    }
  }
  eve (){
    this.canvas.addEventListener("click", this.onClick.bind(this));
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
      v.render(this.ctx, this.stone);
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
  render (ctx, size){
    if(this.prov){
      ctx.beginPath();
      ctx.save();
      ctx.fillStyle= this.prov_c;
      ctx.arc(30+this.prov%15*50, 30+Math.floor(this.prov/15)*50, size, Math.PI*2, 0, false);
      ctx.fill();
      ctx.restore();
    }
    this.items.forEach(v =>{
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle= this.color;
      ctx.arc(v%15*50+30, Math.floor(v/15)*50+30, size, Math.PI*2, 0, false);
      ctx.fill();
    });
  }
}
window.onload= e =>{
  new Gomoku();
}