import React, { Component } from "react";
import "./App.css";

//Visina i širina ploće za igru
const Visina = 10;
const Sirina = 10;

//Keycode vrijednost za A, D, W, S i space
const Lijevo = 65;
const Desno = 68;
const Gore = 87;
const Dolje = 83;
const Zaustavi = 32;

//Postavlja hranu na nasumična mjesta na ploči
const nasumicnaPozicija = () => {
  return {
    x: Math.floor(Math.random() *Sirina),
    y: Math.floor(Math.random() *Visina)
  };
};

//Postavlja dužinu i širinu ploče za igru
const prazniRedovi = () =>
  [...Array(Sirina)].map((_) => [...Array(Visina)].map((_) => "ploca-item"));

//Ograničava brzinu kretanja zmije na 10ms
const povecajBrzinu = (brzina) => brzina - 10 * (brzina > 10);

//Postavljamo početno stanje unutar igre
const pocetnoStanje = {
  redovi: prazniRedovi(),
  zmija: [nasumicnaPozicija()],
  hrana: nasumicnaPozicija(),
  smjer: Zaustavi,
  brzina: 200,
};

class App extends Component {

  constructor() {
      super();
      this.state = pocetnoStanje;
  }

  //Dopušta izvršavanje koda kada je komponenta već postavljena u DOM-u
  componentDidMount() {
    setInterval(this.pomakniZmiju, this.state.brzina);
    document.onkeydown = this.promjenaSmjera;
    document.title = "igra-zmija";
  }

  //Funkcija koja se poziva kada dođe do promjene, provjerava stanje igre
  componentDidUpdate() {
    this.sudarZmije();
    this.poJedeno();
  }

  //Zmija gura svoju kopiju u poljima (zmija2)
  pomakniZmiju = () => {
    let zmija2 = [...this.state.zmija];
    let glava = { ...zmija2[zmija2.length - 1] };
    switch (this.state.smjer) {
      case Lijevo:
        glava.y += -1;
        break;
      case Gore:
        glava.x += -1;
        break;
      case Desno:
        glava.y += 1;
        break;
      case Dolje:
        glava.x += 1;
        break;
    }
    glava.x += Visina * ((glava.x < 0) - (glava.x >= Visina));
    glava.y += Sirina * ((glava.y < 0) - (glava.y >= Sirina));

    //Uz metodu push dodaje se element na kraju niza
    zmija2.push(glava);

    //Metoda shift uklanja prvi element iz niza te tako uz push metodu stvara privid kretanje zmije
    zmija2.shift();
    this.setState({
      zmija: zmija2,
      glava: glava
    });
    this.update();
  }


//Povećava veličinu i brzinu zmije prilikom hranjenja te zatim dodaje hranu na novo nasumicno mjesto
poJedeno()
{
  let zmija2 = [...this.state.zmija];
  let glava = { ...zmija2[zmija2.length - 1] };
  let hrana = this.state.hrana;

  if ((glava.x === hrana.x) && (glava.y === hrana.y)) {
    zmija2.push(glava);
    this.setState({
      zmija: zmija2,
      hrana: nasumicnaPozicija(),
      brzina: povecajBrzinu(this.state.brzina),
    });
  }
}

//Updejta poziciju zmije i hrane na ploči
update()
{
  let noviRedovi = prazniRedovi(); 
  this.state.zmija.forEach(element => noviRedovi[element.x][element.y] = 'zmija')
  noviRedovi[this.state.hrana.x][this.state.hrana.y] = 'hrana';
  this.setState({redovi: noviRedovi});
}

//Postavlja scenario u slučaju sudara zmije i prikazuje rezultat
sudarZmije = () => {
  let zmija = this.state.zmija;
  let glava = { ...zmija[zmija.length - 1] };
  for (let i = 0; i < zmija.length - 3; i++) {
    if (glava.x === zmija[i].x && glava.y === zmija[i].y) {
      this.setState(pocetnoStanje);
      alert(`Bravo, tvoj rezultat je: ${zmija.length * 10}`);
    }
  }
}

//Funkcija koja upravlja promjenom smjera povezana sa keyCode propom
promjenaSmjera = ({ keyCode }) => {
  let smjer = this.state.smjer;
  switch (keyCode) {
    case Lijevo:
      smjer = (smjer === Desno) ? Desno : Lijevo;
      break;
    case Desno:
      smjer = (smjer === Lijevo) ? Lijevo : Desno;
      break;
    case Gore:
      smjer = (smjer === Dolje) ? Dolje : Gore;
      break;
    case Dolje:
      smjer = (smjer === Gore) ? Gore : Dolje;
      break;
    case Zaustavi:
      smjer = Zaustavi;
      break;
    default:
      break;
  }
  this.setState({
    smjer: smjer,
  });
};

//Izvršava ispis (renderiranje) prethodno napisanog koda
render() {
  const prikaziRedove = this.state.redovi.map((red, i) => red.map((value, j) =>  <div name={`${i}=${j}`} className={value} />))
  return (
      <div className="a">
          <div className="tekst">
            <h1><img className="zmijapic" src="https://www.seekpng.com/png/detail/79-791647_rattlesnake-clipart-transparent-snake-cartoon-png.png"></img></h1>
          </div>
          <div className="zmija-container">
              <div className="ploca">{prikaziRedove}</div>
          </div>
          <div className="tekst1">
                <ul>
                    <li>Koristite W-A-S-D kako bi kontrolirali svoju zmiju</li>
                    <li>Za pauzu stisnite space</li>
                  </ul>
            </div>
      </div>
    )   
  }
}

export default App;
