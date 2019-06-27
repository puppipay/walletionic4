import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import {of as observableOf} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {environment} from '../config/environment';
import {webtestnetconsumeconfig, weblivenetconsumeconfig} from '../config/webconsumeconfig';



@Injectable({
  providedIn: 'root'
})

export class Blue011ConsumeService {
  public token: any;
  url: string ;

  messages= [];
//  transactions= [];
  receivetransactions= [];

  constructor(public http: Http, public storage: Storage) {
     this.url = environment.hosteddomain ;
     this.loadmessages() ;
     this.loadreceivetransactions() ;
  }


  savemessage (details: any) {
    if(details != null) {
      this.messages.push(details);
      this.storage.set('messages',this.messages);
    }
  }

  savereceivetransaction (details: any) {
    if(details != null) {
      this.receivetransactions.push(details);
      this.storage.set('receivetransactions',this.receivetransactions);
    }
  }


  loadreceivetransactions() {
      this.storage.get('receivetransactions').then((data)=> {
	if(data) {
        this.receivetransactions = data;
        }
      });
  }

  loadmessages() {
      this.storage.get('messages').then((data)=> {
	if(data) {
        this.messages = data;
        }
      });

  }

  getreceivetransactions() {
    return this.storage.get('receivetransactions');
  }


  
  getmessages() {
    return this.storage.get('messages');
  }


  consumemessage (details: any) {



        return new Promise((resolve, reject) => {


             let headers = new Headers();

            if(details.network == 'testnet'){
                headers.append('Authorization', webtestnetconsumeconfig.apikey);
            }else {
                headers.append('Authorization', weblivenetconsumeconfig.apikey);

            }
             headers.append('Content-Type', 'application/json');

            this.http.post(this.url + '/blue011/consumemessage', JSON.stringify(details), {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });

  }



  getBalance(address: string, network: string): any {

     var url ;

     if(network == 'testnet') {
        url = 'https://testnet-insight.dashevo.org/insight-api/addr/';
     }
     else {
        url = 'https://insight.dashevo.org/insight-api/addr/';
     }

     return new Promise((resolve, reject) => {


     this.http.get(url+address).subscribe(res => {
                let data = res.json();
                resolve(data);
        }, (err) => {
          reject(err);
        });
    });


  }



}
