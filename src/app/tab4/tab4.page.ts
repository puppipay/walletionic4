import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http, Headers } from '@angular/http';
import { Blue011ConsumeService } from '../tab1/blue011.consume.service';


@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {
testnetaddressbalance : any;
livenetaddressbalance : any;
receiveaddress : string;
url: string;
livereceiveaddress: string;
testreceiveaddress: string;

constructor(public http: Http, 
         private blue011consume: Blue011ConsumeService,
	public storage: Storage) {

    this.loadlivenetaddress() ;
    this.loadtestnetaddress() ;

}

loadlivenetaddress() {
     this.storage.get('livereceiveaddress').then(data=> {
	if(data) {
      this.livereceiveaddress = data;
        }
     });
}

loadtestnetaddress() {
     this.storage.get('testreceiveaddress').then(data=> {
	if(data) {
      this.testreceiveaddress = data;
        }
     });
}


savetestnetaddress() {

     this.storage.set('testreceiveaddress', this.testreceiveaddress);

}


savelivenetaddress() {

     this.storage.set('livereceiveaddress', this.livereceiveaddress);

}

gettestnetbalance() {

if(!this.testreceiveaddress) {
 alert("Testnet address empty");
 return;
}

 this.blue011consume.getBalance(this.testreceiveaddress, "testnet").then((data: any) => {
      if(data != null)
      {
        this.testnetaddressbalance = data;
      }
      else {
        alert("Query failed");
      }
   }, (err)=> {
     alert (err)
   });
}


getlivenetbalance() {

if(!this.livereceiveaddress) {
 alert("Livenet address empty");
 return;
}

 this.blue011consume.getBalance(this.livereceiveaddress, "livenet").then((data: any) => {
      if(data != null)
      {
        this.livenetaddressbalance = data;
      }
      else {
        alert("Query failed");
      }
   }, (err)=> {
     alert (err)
   });
}


}
