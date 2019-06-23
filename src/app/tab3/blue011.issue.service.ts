import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import {of as observableOf} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {environment} from '../config/environment';
import {webtestnetissueconfig, weblivenetissueconfig} from '../config/webissueconfig';



@Injectable({
  providedIn: 'root'
})

export class Blue011IssueService {
  public token: any;
  url: string ;

  messages= [];

  constructor(public http: Http, public storage: Storage) {
      this.url = environment.hosteddomain ;

     this.loadmessages() ;
  }


  savemessage (details: any) {
    if(details != null) {
      this.messages.push(details);
      this.storage.set('issuemessages',this.messages);
    }
  }


  loadmessages() {
      this.storage.get('issuemessages').then((data)=> {
	if(data) {
        this.messages = data;
        }
      });

  }
  
  getmessages() {
    return this.storage.get('issuemessages');
  }


  issuemessage (details: any) {



        return new Promise((resolve, reject) => {


             let headers = new Headers();

            if(details.network == 'testnet'){
                headers.append('Authorization', webtestnetissueconfig.apikey);
            }else {
                headers.append('Authorization', weblivenetissueconfig.apikey);

            }
             headers.append('Content-Type', 'application/json');

            this.http.post(this.url + '/blue011/issuemessage', JSON.stringify(details), {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });

  }

  getissuedaddresses () {


        return new Promise((resolve, reject) => {


             let headers = new Headers();
             headers.append('Authorization', webtestnetissueconfig.apikey);
             headers.append('Content-Type', 'application/json');


            this.http.post(this.url + '/getissuedaddresses', null, {headers: headers})
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
