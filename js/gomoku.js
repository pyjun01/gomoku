class Gomoku {
  constructor (){
    this.canvas= document.querySelector("canvas");
    this.ctx= this.canvas.getContext("2d");
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
    this.tg.prov= 112;
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
    console.log(Spos.x+Spos.y*15, this.tg.prov);
    if((Spos.x!=null && Spos.y!=null) && (Math.hypot(Cpos.x-Spos.x*this.block, Cpos.y-Spos.y*this.block)<this.stone)){
      if(this.tg.prov == Spos.x+Spos.y*15){
        this.put(Spos.x+Spos.y*15);
        return;
      }
      this.tg.prov= Spos.x+Spos.y*15;
    }
  }
  onKeydown (e){ 
    switch(e.keyCode){
      case 32:
        this.put(this.tg.prov);
        break;
      case 37:
        if(this.tg.prov-1 >= 0 && !this.list.includes(this.tg.prov-1)) this.tg.prov--;
        break;
      case 38:
        if(this.tg.prov-15 >= 0 && !this.list.includes(this.tg.prov-15)) this.tg.prov-=15;
        break;
      case 39:
        if(this.tg.prov+1 <= 224 && !this.list.includes(this.tg.prov+1)) this.tg.prov++;
        break;
      case 40:
        if(this.tg.prov+15 <= 224 && !this.list.includes(this.tg.prov+15)) this.tg.prov+= 15;
        break;
    }
  }
  eve (){
    this.onClick= this.onClick.bind(this);
    this.onKeydown= this.onKeydown.bind(this);
    this.canvas.addEventListener("click", this.onClick);
    window.addEventListener("keydown", this.onKeydown);
    window.addEventListener("resize", e =>{
      let min= Math.min(window.innerWidth, window.innerHeight);
      this.canvas.width= this.W= min/100*85;
      this.canvas.height= this.H= min/100*85;
      this.space= this.W/100*4;
      this.block= this.W/100*92/14;
      this.stone= this.block/100*40;
    });
  }
  Checkrule (now){
    let items= [...this.list].sort();
    let cnt= 0;
    for(let i= 0; i<3; i++){
      for(let j= 0; j<3; j++){
        // if((i == 0 && now%15 == 0 && now < 15) && j != 2) continue;
        // if((i == 2 && (now-14)%15 == 0) && j != 2) continue;
        let num= [
          now+(-14-i)*(3-j), 
          now+(-14-i)*(2-j-(Math.floor(j/2))), 
          now+(-14-i)*(1-j-(Math.ceil(j/2))), 
          now,
          now+(-14-i)*(-1-j)
        ];
        let arr= num.map(v => Math.floor(v/15));
        if( 
          (!items.includes(num[0]) && 
          items.includes(num[1]) && 
          items.includes(num[2]) && 
          !items.includes(num[4])) &&
          !(arr.some( (v,n) =>{
            if(n != 0 && v-arr[n-1] != 1) return true;
          }))
        ){
          cnt++;
          break;
        }
      }
    }
    for(let i= 0; i<3; i++){
      if(
        !items.includes(now-3+i) && 
        items.includes(now-2+i+Math.floor(i/2)) && 
        items.includes(now-1+i+Math.ceil(i/2)) && 
        !items.includes(now+1+i) &&
        ([...new Set( [now-3+i, now-2+i+Math.floor(i/2), now-1+i+Math.ceil(i/2), now+1+i].map(v => Math.floor(v/15)) )].length == 1)
      ){
        cnt++;
        break;
      }
    }
    console.log(cnt);
    return cnt >= 2;
  }
  put (l){
    if(!this.turn && this.Checkrule(l)){
      return;
    }
    this.list.push(l);
    this.tg.items.push(l);
    this.tg.prov= null;
    if(this.isEnd()) return;
    this.turn= !this.turn;
    this.tg= this.player[+this.turn];
    let i= 0;
    while(this.list.includes(i)){
      i++;
    }
    this.tg.prov= i;
  }
  isEnd (){
    let sort= [...this.tg.items].sort();

    for(let i= 1, stack= 0, len= sort.length; i<len; i++){
      if(sort[i] != null && sort[i-1] != null && sort[i]-sort[i-1] == 1 && sort[i]%15 != 0 && (sort[i]-14)%15 != 0){
        stack++;
      }else{
        stack= 0;
      }
      if(stack == 4){ 
        this.end();
        return true;
      }
    }
    for(let k= 0, stack= 0; k<3; k++){
      for(let i= 0, len= sort.length; i<len; i++){
        stack= 0;
        for(let j= 1; j<=4; j++){
          if(k == 0 && sort[i]%15 == 0) break;
          if(k == 2 && (sort[i]-14)%15 == 0) break;
          if(sort.includes(sort[i]+j*(14+k))){
            stack++;
          }else{
            stack= 0;
            break;
          }
          if(k == 0 && (sort[i]+j*(14+k))%15 == 0) break;
          if(k == 2 && (sort[i]+j*(14+k)-14)%15 == 0) break;
        }
        if(stack == 4){
          this.end();
          return true;
        }
      }
    }
    return false;
  }
  end (){
    console.log('end');
    this.canvas.removeEventListener("click", this.onClick);
    window.removeEventListener("keydown", this.onKeydown);
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
    this.ctx.save();
    this.ctx.fillStyle= "#000";
    for(let i= 0; i<3; i++){
      for(let j= 0; j<3; j++){
        this.ctx.beginPath();
        this.ctx.arc(this.space+this.block*(3+4*i), this.space+this.block*(3+4*j), 5, Math.PI*2, 0, false);
        this.ctx.fill();
      }
    }
    this.ctx.restore();
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
     this.text_c= isBlack? "rgb(255, 255, 255)": "rgb(0, 0, 0)";
     this.expression= n => n*2+(isBlack? 1: 2);
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
    ctx.save();
    ctx.textAlign= "center";
    ctx.textBaseline= "middle";
    ctx.font= "16px sans-serif";
    this.items.forEach((v, n) =>{
      ctx.beginPath();
      ctx.fillStyle= this.color;
      ctx.arc(v%15*gomoku.block+gomoku.space, Math.floor(v/15)*gomoku.block+gomoku.space, gomoku.stone, Math.PI*2, 0, false);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle= this.text_c;
      ctx.fillText(this.expression(n), v%15*gomoku.block+gomoku.space, Math.floor(v/15)*gomoku.block+gomoku.space);
    });
    ctx.restore();
  }
}
window.onload= e =>{
  new Gomoku();
}