import "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
import { firebase } from "../lib/firebase.js";
import { userController } from "../user/userController.js";
import { wait } from "../lib/wait.js";
import { firestore } from "../lib/firestore.js";

/* Javascript - app/app.js */
export const app = {

    verticesTrilha: [],
    linhaTrilha: null,
    mapeando: false,
    currentZoom: 18,

    /**
     * Init controller
     */
    async init() {
        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyBJD_5IDTtkmF1J7CNgUgFD4hqKCgs9oMs",
            authDomain: "trilhasapp2024.firebaseapp.com",
            projectId: "trilhasapp2024",
            storageBucket: "trilhasapp2024.appspot.com",
            messagingSenderId: "108150164761",
            appId: "1:108150164761:web:74e406ad0458e1e3798988"
        };

        // **** Start Initialize app ****
        try {
            wait.show();

            //Firebase initialization
            this.firebase = firebase;
            await this.firebase.init(firebaseConfig);

            //Initialize controllers
            await userController.init(this.firebase.auth);

            //Initialize controllers
            //Load 'app.html'
            let html = document.createElement("div");
            html.innerHTML = await (await fetch("app/app.html")).text();

            //Add HTML elements from 'app.html'
            this.bMenu = html.querySelector("#bMenu");
            this.bEncerra = html.querySelector("#bEncerra");
            this.menu = html.querySelector("#menu");
            this.userMenu = html.querySelector("#userMenu");
            this.map = html.querySelector("#mapa");
            document.body.appendChild(this.userMenu);
            document.body.appendChild(this.bMenu);
            document.body.appendChild(this.bEncerra);
            document.body.appendChild(this.menu);
            document.body.appendChild(this.map);

            this.bEncerra.style.display = "none";
            this.menu.style.display = "none";

            //Botão menu
            this.bMenu.onclick = () => {
                this.menu.style.display = this.menu.style.display !== "none" ? "none" : "block";
            };
            //Botão p/ iniciar o mapeamento da trilha
            this.menu.querySelectorAll("button")[0].onclick = () => {
                if (confirm("Você deseja iniciar o mapeamento de uma nova trilha?")) {
                    this.menu.style.display = "none";
                    this.menu.querySelectorAll("button")[0].style.display = "none";
                    this.bEncerra.style.display = "block";
                    this.mapeando = true;
                    if (this.linhaTrilha !== null) {
                        this.mapa.removeLayer(this.linhaTrilha);
                    }
                    this.verticesTrilha = [];
                    this.verticesTrilha.push(this.player.getLatLng());
                }
            };
            //Botão p/ encerrar o mapeamento da trilha
            this.bEncerra.onclick = async () => {
                //Grava no BD
                if (this.verticesTrilha.length >= 5) {
                    let titulo = prompt("Digite um título para a trilha:");
                    if (titulo !== null) {
                        let medLat = 0;
                        let medLng = 0;
                        for (let i = 0; i < this.verticesTrilha.length; i++) {
                            medLat += this.verticesTrilha[i].lat;
                            medLng += this.verticesTrilha[i].lng;
                        }
                        medLat /= this.verticesTrilha.length;
                        medLng /= this.verticesTrilha.length;

                        let data = {
                            titulo: titulo,
                            lat: medLat.toFixed(6),
                            lng: medLng.toFixed(6),
                            vertices: JSON.stringify(this.verticesTrilha)
                        }
                        await firestore.add("trilha", data);
                        alert("A trilha " + titulo + " foi gravada com sucesso.");

                        
                    } else  {
                        if (this.linhaTrilha !== null) {
                            this.mapa.removeLayer(this.linhaTrilha);
                            this.linhaTrilha = null;
                            this.verticesTrilha = [];
                        }
                    }
                    this.menu.querySelectorAll("button")[0].style.display = "block";
                    this.bEncerra.style.display = "none";
                    this.mapeando = false;
                } else {
                    if(!confirm("ERRO: Falha ao gravar a trilha, percorra um trajeto maior!\n\nVocê deseja continuar mapeando a trilha?")){
                        if (this.linhaTrilha !== null) {
                            this.mapa.removeLayer(this.linhaTrilha);
                            this.linhaTrilha = null;
                            this.verticesTrilha = [];
                        }
                        this.menu.querySelectorAll("button")[0].style.display = "block";
                        this.bEncerra.style.display = "none";
                        this.mapeando = false;
                    }
                }
            };

            //Button login / logout
            this.userMenu.querySelector("button").onclick = async () => {
                if (this.firebase.auth.currentUser() === null) {
                    await userController.showLoginForm();
                } else {
                    await userController.showLogoutForm();
                }
                this.refreshMenu();
            };

            //Function on firebase authentication state changed
            this.firebase.auth.authStateChanged(() => this.refreshMenu());

            //Inicia o mapa
            this.mapa = L.map('mapa', { zoomControl: false, attributionControl: false });
            //Define o tipo de mapa
            /*
            const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            // const tiles = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                minZoom: 18,
                maxZoom: 20,
                attribution: ''
            });
            tiles.addTo(this.mapa);
            */
            const tiles = L.tileLayer('http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}', {
                minZoom: 17,
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            });
            tiles.addTo(this.mapa);

            //Define a posição do mapa pela geolocalização
            this.mapa.locate({ watch: true, enableHighAccuracy: true });

            //Marcador do jogador
            this.player = new L.Marker([0, 0]);
            this.player.addTo(this.mapa);

            //Ao finalizar o zoom 
            this.mapa.on("zoomend", (evt) => {
                this.currentZoom = this.mapa.getZoom();
            });
            //Atualiza a posição do marcador player
            this.mapa.on("locationfound", (evt) => {
                this.mapa.setView(evt.latlng, this.currentZoom);
                this.player.setLatLng(evt.latlng);
                let latDir = evt.latlng.lat === 0 ? "" : evt.latlng.lat > 0 ? "N" : "S";
                let latDeg = Math.abs(evt.latlng.lat);
                let latMin = (latDeg - parseInt(latDeg)) * 60;
                let latSec = (latMin - parseInt(latMin)) * 60;
                latDeg = parseInt(latDeg);
                latMin = parseInt(latMin);
                latSec = latSec.toLocaleString(window.navigator.language, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
                let lngDir = evt.latlng.lng === 0 ? "" : evt.latlng.lng > 0 ? "E" : "W";
                let lngDeg = Math.abs(evt.latlng.lng);
                let lngMin = (lngDeg - parseInt(lngDeg)) * 60;
                let lngSec = (lngMin - parseInt(lngMin)) * 60;
                lngDeg = parseInt(lngDeg);
                lngMin = parseInt(lngMin);
                lngSec = lngSec.toLocaleString(window.navigator.language, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
                this.player.bindPopup(`<table>
                                <tr><td><b>Latitude decimal: </b> <td>${evt.latlng.lat.toLocaleString(window.navigator.language, { maximumFractionDigits: 5, minimumFractionDigits: 5 })}<br>
                                <tr><td><b>Longitude decimal: </b><td>${evt.latlng.lng.toLocaleString(window.navigator.language, { maximumFractionDigits: 5, minimumFractionDigits: 5 })}<br>
                    
                                <tr><td><b>Latitude graus: </b> <td>${latDeg}°${latMin}'${latSec}'' ${latDir}<br>
                                <tr><td><b>Longitude graus: </b><td>${lngDeg}°${lngMin}'${lngSec}'' ${lngDir}<br>
                            </table>`);
                if (this.mapeando && (this.verticesTrilha.length === 0 || evt.latlng.distanceTo(this.verticesTrilha[this.verticesTrilha.length - 1]) >= 3)) {
                    if (this.linhaTrilha !== null) this.mapa.removeLayer(this.linhaTrilha);
                    this.verticesTrilha.push(evt.latlng);
                    this.linhaTrilha = new L.polyline(this.verticesTrilha);
                    this.linhaTrilha.addTo(this.mapa);
                }
                
                this.getTrilhas();
            });

        } catch (error) {
            alert(error);
            //console.log(error);
        } finally {
            wait.hide();
        }
        // **** End Initialize app ****
    }, //init

    refreshMenu() {
        let user = firebase.auth.currentUser();
        if (user === null) {
            //Menu de login (Usuário não autenticado)
            this.userMenu.querySelector("#currentUser").innerHTML = "";
            this.userMenu.querySelector("button > img").src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👤</text></svg>";
            this.menu.querySelectorAll("button")[0].style.display = "none";
        } else {
            //Menu de logout (Usuário já autenticado)
            this.userMenu.querySelector("#currentUser").innerHTML = user.displayName ? user.displayName : user.email;
            this.userMenu.querySelector("button > img").src = user.photoURL ? user.photoURL : "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👤</text></svg>";
            this.menu.querySelectorAll("button")[0].style.display = "block";
        }
    }, //refreshMenu

    async getTrilhas() {
        //Obtém a div para exibir as trilhas
        let trilhasProx = document.querySelector("#trilhasProx");
        trilhasProx.innerHTML = "";
        //Obtém as coordenadas do jogador
        let coord = this.player.getLatLng();
        //Obtém as trilhas próximas
        this.trilhas = await firestore.loadCollection("trilha"//,
            //{ field: "lng", operator: ">=", value: (coord.lng - 0.1) }//,
            //{ field: "lng", operator: "<=", value: (coord.lng + 0.1) }
        );
        //this.trilhas = await firestore.loadCollection("trilha");

        console.log(coord);
        console.log(Object.keys(this.trilhas));
        for(let id in this.trilhas) {
            let trilha = this.trilhas[id];
            if(trilha.lat >= (coord.lat - 0.1) && trilha.lat <= (coord.lat + 0.1)) {
                let button = document.createElement("button");
                button.innerHTML = trilha.titulo;
                button.style.width = "100%";
                button.onclick = () => this.showTrilha(id);
                trilhasProx.appendChild(button);
            } else {
                delete(this.trilhas[id]);
            }
        }
        //console.log(this.trilhas);
    },

    showTrilha(id) {
        let trilha = this.trilhas[id];
        console.log(trilha);
        if (this.linhaTrilha !== null) this.mapa.removeLayer(this.linhaTrilha);
        this.linhaTrilha = new L.polyline(JSON.parse(trilha.vertices));
        this.linhaTrilha.setStyle({
            color: 'red'
        });
        
        this.linhaTrilha.addTo(this.mapa);
    }
}; //app