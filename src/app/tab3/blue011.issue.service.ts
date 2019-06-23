import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import {of as observableOf} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {environment} from '../config/environment';
import {webtestnetissueconfig, weblivenetissueconfig} from '../config/webissueconfig';

declare var dashcore;

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

   getUtxo(address: string, network: string): any {

     var url ;

     if(network == 'testnet') {
        url = 'https://testnet-insight.dashevo.org/insight-api/addr/';
     }
     else {
        url = 'https://insight.dashevo.org/insight-api/addr/';
     }

     return new Promise((resolve, reject) => {


     this.http.get(url+address+"/utxo").subscribe(res => {
                let data = res.json();
                resolve(data);
        }, (err) => {
          reject(err);
        });
    });


  }

  createtransaction(utxo, privatekey,changeaddress, toaddress, toamount,fees) {

  var tx = new dashcore.Transaction()
      .from(utxo)
      .to([{address: toaddress, satoshis: toamount}])
      .fee(fees)
      .change(changeaddress)
      .sign(privatekey);

  var txobject = tx.toBuffer();

   return txobject;
 }


  broadcast( tx) {
 
   var pushtx = { 
    rawtx: tx
   };  


   var lurl = 'https://testnet-insight.dashevo.org/insight-api/tx/send';

   return new Promise((resolve, reject) => {


             let headers = new Headers();

             headers.append('Content-Type', 'application/json');

            this.http.post(lurl, JSON.stringify(pushtx), {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });

  }


 
/*


 regularDashcoinSendingFund(type, amount, targetaddr, activatingkeypair, choosenplan, gdata)
{


var activatepromise = new Promise(function (resolve, reject) {
    var spendingaddr = activatingkeypair.toAddress(gdata.globalnetwork).toString() ;
    var returnaddr = spendingaddr;
    logger.log("spendingaddr="+spendingaddr);
    var balpromise = getDashBalance(spendingaddr );

    balpromise.then(function(globalbalance) {


    var hashType = 1 ;
    if(globalbalance == 0)
    {
	logger.log("globalbalance="+globalbalance);
        var error = "Balance is zero";
             var myerror = {
               error: "Dash balance is zero",
               context: "regularDashcoinSendingFund: Dash balance is zero",
             };
        reject(myerror);

    }    

    logger.log("globalbalance="+globalbalance);

    var txpromise = this.processtx(spendingaddr );

    txpromise.then(function(txreceived) {
    var spendoutlist = txreceived;
    var inputs=txreceived;
    logger.log("before oupputs="+JSON.stringify(activationshares));

 var   outputs = [
     { 
    satoshis: targeramount,
    address: targetaddress
     },
    satoshis: returnamount,
    address: returnaddress
     }

    ];
 
   logger.log(JSON.stringify(outputs));


   var tx = dashrambitcore.Transaction( )
	.from(inputs)
	.to(outputs)
        .change(returnaddress)
	.sign(activatingkeypair );

   var txobject = tx.toBuffer();

   logger.log("regularDashcoinSendingFund: txobject ");
   resolve(txobject);
    }).catch (function(error){

	logger.log("regularDashcoinSendingFund : Issue getting txs");
             var myerror = {
               error: "error",
               context: "regularDashcoinSendingFund: Issue getting txs",
             };
        reject(myerror);
    });
    }).catch (function(error){

	logger.log("regularDashcoinSendingFund : Issue getting balances");
             var myerror = {
               error: "error",
               context: "regularDashcoinSendingFund: Issue getting balances",
             };
        reject(myerror);
    });
  });

  return activatepromise;

}


  processtx(address)
  {

 console.log("Doing processtx "+ address);
var globalurl1 = "https://testnet-insight.dashevo.org"; //yWGQRPF8ZYzM2YmX6ZAdHjwWgonEEyKppo

var url1 = globalurl1 + "/insight-api/addr/"+address+"/utxo";
   logger.log('Processtx calling url:'+ url1)
var promise = new Promise(function (resolve, reject) {
    
   logger.log('Processtx calling url:'+ url1)
    request.get(url1   , function (error, response, body1) {
        if (error) {
           logger.log('Processtx error :'+ error)
             var myerror = {
               error: error,
               context: "processtx: failed to get utxo",
             };
           reject(myerror);
        }
        logger.log('Body:'+ body1)
        var body;

          try {
            body = JSON.parse(body1)
          } catch (err) {

                logger.log('Body parse failed'+ err)
             var myerror = {
               error: err,
               context: "processtx: Json body parse failed",
             };
		reject(myerror);
          }
        logger.log('before body.map');
	var n = body.map(function(x) {
        logger.log('x');
    var p = {
"txId" : x.txid,
  "outputIndex" : x.vout,
  "address" : x.address,
  "script" : x.scriptPubKey,
  "satoshis" : x.satoshis
	 };
    return p; 
        });


        logger.log('resolve n');
	resolve(n);
  });
});

return promise;

}

*/
}
