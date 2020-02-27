import { Injectable } from '@angular/core';
import {  HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com';
  private apiKey = 'AIzaSyDP-mIDk1_myua7xMZlOYbnToBcnqJxCbw';
  // Crear nuevos usuarios
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=[API_KEY]
  // Login
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY] 
  usuarioToken: string; 

  constructor( private http: HttpClient) {
    this.leerToken();
   }

  logOut(){
    localStorage.removeItem('token');
  }
  login(usuario: UsuarioModel){
    const authData = {
      ...usuario,
      returnSecureToken: true
    };
    
    return this.http.post(`${this.url }/v1/accounts:signInWithPassword?key=${this.apiKey}`,authData).pipe(map( resp =>{
      this.guardarToken(resp['idToken']);
      return resp;
    })
  );

  }
  nuevoUsuario(usuario: UsuarioModel){
    const authData = {
      ...usuario,
      returnSecureToken: true
    };
    return this.http.post(`${this.url}/v1/accounts:signUp?key=${this.apiKey}`,authData).pipe(map( resp =>{
      console.log('Entrar en el mapa');
      this.guardarToken(resp['idToken']);
      return resp;
    })
  );
  }

  private guardarToken (idToken: string){

    this.usuarioToken= idToken;
    localStorage.setItem('token', idToken);

    let today = new Date();
    today.setSeconds( 3600);

    localStorage.setItem('experired', today.getTime().toString());

  }

  leerToken(){
      if(localStorage.getItem('token')){
        this.usuarioToken = localStorage.getItem('token');
      }else{ 
      this.usuarioToken = '';
    }
    return this.usuarioToken;
  }

  estaAutenticado(): boolean{

    if (this.usuarioToken.length < 2) {
      return false;
    }

    const experired = Number(localStorage.getItem('expired'));
    const expiredDate = new Date();
    expiredDate.setTime(experired);

    if (expiredDate > new Date()) {
      return true;
    }else{
      return false;
    }
  } 
}
