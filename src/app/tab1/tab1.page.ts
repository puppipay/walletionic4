import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Blue011ConsumeService } from './blue011.consume.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

public revertible : any;
public transacted : any;
public addressbalance: any;

constructor(
	private storage: Storage,
	private blue011consume: Blue011ConsumeService

  ) {
}


ngOnInit() {

 this.transacted = {
    "txid": "",
    "amount": "",
    "fromaddress": "",
    "toaddress": "",
  };

 this.revertible = {
    "message": "",
    "pin": "",
    "address": "",
    "target": "",
    "network": "",
    "type": "",
    };



}

loadlivenetaddress() {
     this.storage.get('livereceiveaddress').then(data=> {
        if(data) {
        this.revertible.target = data;
        }
     });
}

loadtestnetaddress() {
     this.storage.get('testreceiveaddress').then(data=> {
        if(data) {
        this.revertible.target = data;
        }
     });
}

consumetestnetmessage() {

if(!this.revertible.message) {
 alert("Message field empty");
 return;
}

if(!this.revertible.pin) {
 alert("PIN field empty");
 return;
}

this.revertible.network = 'testnet';

 this.blue011consume.savemessage(this.revertible);

 this.blue011consume.consumemessage(this.revertible).then((data: any) => {
      if(data != null)
      {
        this.transacted = data;
        this.blue011consume.savetransaction(this.transacted);
      }
      else {
        alert("Consume failed");
      }
   }, (err)=> {
     alert (err)
   });


}

consumelivenetmessage() {

if(!this.revertible.message) {
 alert("Message field empty");
 return;
}

if(!this.revertible.pin) {
 alert("PIN field empty");
 return;
}
 
this.revertible.network = 'livenet';

 this.blue011consume.savemessage(this.revertible);

 this.blue011consume.consumemessage(this.revertible).then((data: any) => {
      if(data != null)
      {
        this.transacted = data;
        this.blue011consume.savetransaction(this.transacted);
      }
      else {
        alert("Consume failed");
      }
   }, (err)=> {
     alert (err)
   });


}
 
gettestnetbalance() {

if(!this.revertible.address) {
 alert("Address empty");
 return;
}

 this.blue011consume.getBalance(this.revertible.address, "testnet").then((data: any) => {
      if(data != null)
      {
        this.addressbalance = data;
      }
      else {
        alert("Query failed");
      }
   }, (err)=> {
     alert (err)
   });
}


getlivenetbalance() {

if(!this.revertible.address) {
 alert("Address empty");
 return;
}

 this.blue011consume.getBalance(this.revertible.address, "livenet").then((data: any) => {
      if(data != null)
      {
        this.addressbalance = data;
      }
      else {
        alert("Query failed");
      }
   }, (err)=> {
     alert (err)
   });
}



}
