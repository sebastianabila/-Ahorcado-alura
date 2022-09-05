alert("Creado Por Sebastian");
const ahorcado = document.querySelector(".contenedor");
const inicio = ahorcado.querySelector(".inicio");
const agregar_palabra = ahorcado.querySelector(".agregar_palabra");
const iniciar_juego = ahorcado.querySelector(".iniciar_juego");

let escribir = true;
let secreto = '';
let contar = 0;


if( localStorage.getItem('listaPalabras') === null ) {
	localStorage.setItem('listaPalabras', listaPalabras);
} 
const lista = (localStorage.getItem('listaPalabras') === null) ? listaPalabras.join(',') : localStorage.getItem('listaPalabras');

let palabrasExistentes = lista.split(',');
function agregarPalabraLista(array = '') {
	agregar_palabra.querySelector(".lista_palabras ul").innerHTML = ''
	agregar_palabra.querySelector('textarea').value = ''
	var mapear = (array !== '') ? array : palabrasExistentes;
	mapear.map( (palabra, posicion) => {
		
		agregar_palabra.querySelector(".lista_palabras ul").innerHTML += `<li class="display-inline-block" id="palabra_${posicion}">${palabra}</li>`
	})
}
agregarPalabraLista()



const itemArray = [].slice.call(agregar_palabra.querySelector(".lista_palabras ul").children)

itemArray.map( eliminar => {
	eliminar.addEventListener('click', e => {
		quien = document.getElementById(e.target.id).textContent;
		editarLista = lista.split(',');
		
		let nLista = [];
		for(let n = 0; n < editarLista.length; n++) {
			if(quien !== editarLista[n]) nLista.push(editarLista[n])
		}
		
		localStorage.setItem('listaPalabras', nLista);
		agregarPalabraLista(nLista);
		location.reload();
	})
})



const fnComprobarAntes = strArr => {
	strArr = strArr.trim().split(' ');
   const resp = [];
   for(let i = 0; i < strArr.length; i++){
      if(strArr.indexOf(strArr[i]) !== strArr.lastIndexOf(strArr[i])){
         if(!resp.includes(strArr[i])) {
         	if(strArr[i].length >= 4) resp.push(strArr[i]);
         }
      } else {
      	if(strArr[i].length >= 4) resp.push(strArr[i]);
      }
   }
   return resp;
}


function fnObtenerListaCreada() {
	let getList = []
	const obtenerLista = [].slice.call(agregar_palabra.querySelectorAll(".lista_palabras ul li"));
	obtenerLista.map( item => getList.push(item.textContent))
	return getList;
}


function fnAgregarPalabra() {
	let lista = localStorage.getItem('listaPalabras').split(',');
	const nuevasPalabras = agregar_palabra.querySelector('textarea').value;
	const comprobar = fnComprobarAntes(nuevasPalabras);
	
	for(var i = 0; i < comprobar.length; i++) {
		if(fnObtenerListaCreada().includes(comprobar[i]) === false) {
			newWord = comprobar[i].trim();
			lista.push(newWord);
			var item = document.createElement('li');
		   item.setAttribute("class", "display-inline-block");
		   item.innerHTML = newWord;
		   agregar_palabra.querySelector("ul").insertAdjacentElement("beforeend", item);
		   agregarPalabraLista(lista);
		}		
	}	
	localStorage.setItem('listaPalabras', lista);
}


const botones = [].map.call(ahorcado.querySelectorAll(".boton"), boton => {
	boton.addEventListener('click', event => {
		bloque = event.target.dataset.div;
		switch (bloque) {
			case 'agregar':
				fnAgregarPalabra();
			break; 
			case 'reiniciar':
			case 'nuevo':
				fnPalabraSecreta();
				fnReiniciar();
			break; 
			case 'regresar':
			case 'insertar':
				inicio.style.display = (bloque === 'regresar' ? 'block' : 'none');
				agregar_palabra.style.display = (bloque === 'regresar' ? 'none' : 'block');
			break; 
			case 'iniciar':
			case 'desistir':
				if(bloque === 'iniciar') {
					fnPalabraSecreta();
					
					function repeatFN(ltr) {
						fnLetraCorrecta(ltr)
						if(fnComprobar()) {
							miAlerta.iniciar("Ganaste, felicidades")
							document.querySelector(".modal").style.color = "green"
							fnPalabraSecreta();
						}
						fnLetraEquivocada(ltr)
						if(contar >= 11) {
							miAlerta.iniciar("Fin del juego")
							document.querySelector(".modal").style.color = "red"
							fnPalabraSecreta();
						}
					}
					const tecladoMovil = [].slice.call(document.querySelectorAll(".teclas input"))
					tecladoMovil.map( tecla => {
						tecla.onclick = valor => repeatFN(valor.target.value)
					})
					document.onkeypress = tecla => {
						if(tecla.charCode >= 97 && tecla.charCode <= 122) repeatFN(tecla.key)
					}
				}
				inicio.style.display = (bloque === 'iniciar' ? 'none' : 'block');
				iniciar_juego.style.display = (bloque === 'iniciar' ? 'block' : 'none');
			break; 
		}
	})
})


function fnPalabraSecreta() {
	document.querySelector(".palabras").innerHTML = ''
	document.querySelector(".escritas").innerHTML = ''
	let IndexOfList = Math.round(Math.random() * lista.split(',').length);
	let WordSecret = lista.split(',')[IndexOfList];
	WordSecret.split('').map( (letra, posicion) => document.querySelector(".palabras").innerHTML += '<input type="text" id="p'+posicion+'" class="line"/>')
	secreto = WordSecret;
	return WordSecret
}

function fnLetraCorrecta(letra) {
	letra = letra.toLowerCase()
	let descomponerPalabra = secreto.split('');

	for(let init = 0;init <= descomponerPalabra.length; init++) {
		if(letra === descomponerPalabra[init]) {
			document.getElementById("p" + init).classList.add('add')
			document.getElementById("p" + init).value = letra.toLowerCase()
		}
	}
}

function fnLetraEquivocada(letra) {
	letra = letra.toLowerCase()
	const descomponerPalabra = secreto.split('');
	let continuar = true;
	let yalotiene = '';
	let mal = [].slice.call(iniciar_juego.querySelectorAll(".escritas .ya"));
	if(!descomponerPalabra.includes(letra)) {
		for (var i = 0; i < mal.length; i++) {
			if(mal[i].textContent === letra) {
				continuar = false;
			}
		}
		if(continuar) {
			document.querySelector(".escritas").innerHTML += '<span class="ya">'+letra+'</span>';
			contar += 1;
			console.log(contar)
			const armar = document.querySelectorAll(".ahorcado .armar");
			for(let a = 0; a < armar.length; a++) {
				armarInt = parseInt(armar[a].getAttribute('armar'));
				if(armarInt === contar) {
					armar[a].style.display = 'block'
				}
			}
		}
		
	}
}

function fnReiniciar() {
	const armar = document.querySelectorAll(".ahorcado .armar");
	for(let a = 0; a < armar.length; a++) {
		armarInt = parseInt(armar[a].getAttribute('armar'));
		armar[a].style.display = 'none'
	}
	contar = 0;
}

function fnComprobar() {
	let arr = [];
	let obtenerLetras = iniciar_juego.querySelectorAll(".palabras .line.add")
	for(var letra = 0; letra < obtenerLetras.length; letra++) {
		arr.push(obtenerLetras[letra].value)
	}
	return (arr.join('') === secreto);
}

document.onkeydown = tecla => {
	if(tecla.code === "Enter" || tecla.key === "Enter" || tecla.keyCode === 13) {
		fnAgregarPalabra();
		tecla.preventDefault()
		return false;
	} else if(tecla.code === "Escape" || tecla.key === "escape" || tecla.keyCode === 27) {
		miAlerta.quitar();
		fnReiniciar()
	}
}

var miAlerta = {
	relanzar: () => {
		miAlerta.quitar();
		contar = 0;
		fnReiniciar()
	},
	iniciar: mensaje => {
		const plantilla = `<div class="mascara" onclick="miAlerta.relanzar()"><div class="modal">${mensaje}</div></div>`
		document.querySelector("#mymodal").innerHTML = plantilla
	},
	quitar: () => document.querySelector("#mymodal").innerHTML = ''
}

if (!String.prototype.trim) {
  	(() => String.prototype.trim = () => this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''))();
}