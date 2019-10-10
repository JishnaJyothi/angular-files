import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
//services
import { CreateContractService } from '@services/create-contract.service';
import { ApiService } from '@services/api.service';
//alert & constants
import { AlertBox } from '@utils/alert-box';
import {
  ALERT_UPDATED,
  ALERT_ERROR,
  ALERT_MESSAGE_ERROR,
  ALERT_MESSAGE_API_ERROR
} from "@constants/alertMessages";
import { environment } from "@environments/environment";

@Component({
  selector: 'app-template-store',
  templateUrl: './template-store.component.html',
  styleUrls: ['./template-store.component.css']
})
export class TemplateStoreComponent implements OnInit {
  public addTriggerForm: FormGroup;

  public serverUrl: any;
  public smartClause: any;
  public contract: any;

  data = {
      triggerInfo: [
        {
          tType: "http",
          tURI: "https://www.example.com",
          tMethod:"Select an http method",
          triggerHeaderInfo: [
            {
              hName: "authorization",
              hValue: "value"
            }
          ],
          tBody:'{}'
        }
      ]
    }

  constructor(
    private cCService: CreateContractService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private alert: AlertBox
  ) { }

  ngOnInit() {
    this.cCService.dynamicContract.subscribe(contract => {
      this.setContract(contract);
    });
    this.cCService.dynamicSmartClause.subscribe(smartClause => {
      this.setSmartClause(smartClause);
    });

    //form to add signatories
    this.addTriggerForm = this.formBuilder.group({
      triggerName: '',
      triggerType: '',
      triggerInfo: this.formBuilder.array([])
    });

    this.setTriggerInfo();
  }

  setSmartClause(smartClause){
    this.serverUrl = `${environment.serverUrl}/clause/${smartClause._id}/trigger`
    this.smartClause = smartClause;
  }
  setContract(contract){
    this.contract = contract;
  }

  setTriggerInfo() {
    const trgInfo = this.addTriggerForm.controls.triggerInfo as FormArray;
      this.data.triggerInfo.forEach(x => {
      trgInfo.push(this.formBuilder.group({
        tType: x.tType,
        tURI: x.tURI,
        tMethod: x.tMethod,
        triggerHeaderInfo: this.setTHeaderInfo(x),
        tBody: x.tBody
      }));
    })
  }
  setTHeaderInfo(x) {
    let arr = new FormArray([])
   x.triggerHeaderInfo.forEach(y => {
     arr.push(this.formBuilder.group({
       hName: y.hName,
       hValue:y.hValue
     }))
   })
   return arr;
  }

  addTriggerInfo() {
    const trgInfo = this.addTriggerForm.controls.triggerInfo as FormArray;
    trgInfo.push(this.formBuilder.group({
      tType: ['http'],
      tURI: ['https://www.example.com'],
      tMethod: ['Select an http method'],
      triggerHeaderInfo: this.formBuilder.array([
        this.formBuilder.group({
          hName: 'authorization',
          hValue: 'value'
        })
      ]),
      tBody: ['']
    }));
  }
  removeTriggerInfo(i: any) {
    const trgInfo = this.addTriggerForm.controls.triggerInfo as FormArray;
    trgInfo.removeAt(i)
  }

  addTHeaderInfo(headInfo) {
    headInfo.push(this.formBuilder.group({
      hName: 'authorization',
      hValue: 'value'
    }));
  }
  removeTHeaderInfo(control, j) {
     control.removeAt(j)
  }
}
