import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Blue011ConsumeService } from '../tab1/blue011.consume.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

public transactions = [];

constructor(
        private blue011service: Blue011ConsumeService

  ) {
}

ngOnInit() {

this.gettransactions();

}


gettransactions() {

   this.blue011service.gettransactions().then((data: any) => {
      if(data != null)
      {
        this.transactions = data;
      }
      else {
        alert("No transactions ");
    }
    });

}
 

}
