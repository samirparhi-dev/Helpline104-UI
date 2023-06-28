import {Injectable} from '@angular/core';
import {Http, Response,Headers,RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from "../../config/config.service";
import { SecurityInterceptedHttp } from '../../../http.securityinterceptor';

@Injectable()
export class SPService{
    _adminAPIUrl = this._config.getAdminBaseURL();
    test=[];
     headers = new Headers(
     {'Content-Type': 'application/json'}
    //  ,{'Access-Control-Allow-Headers': 'X-Requested-With, content-type'}
    //   ,{'Access-Control-Allow-Origin': 'localhost:4200'}
    //  ,{'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'}
    //  ,{'Access-Control-Allow-Methods': '*'}
       );
     options = new RequestOptions({ headers: this.headers });
     private _geturl: string = this._adminAPIUrl+"getprovider";
    //  private _geturl: string = "http://localhost:8080/adminAPI/getprovider";
     private _saveurl: string = this._adminAPIUrl+"saveprovider";
     private _deleteurl:string=this._adminAPIUrl+"Delete"
     private _updateurl:string=this._adminAPIUrl+"UpdateServiceProvider"
    //private _url:string="http://10.152.3.152:1040/Admin1.1/iEMR/Admin/userAuthenticate/test/sinu"
     //private _url:string="./app/providerdata.json"
    constructor(private _http:SecurityInterceptedHttp,private _config: ConfigService){}
    getProviders(){
        
        return this._http.post(this._geturl,this.options)
        .map((response:Response)=> response.json());
        
    }
    saveProviders(data:any){

        //console.log(data);
        return this._http.post(this._saveurl,data ,this.options)
        
        .map((response:Response)=> response.json());
        
    }
    
    deleteProviders(request:any){
        return this._http.post(this._deleteurl,request ,this.options)
        .map((response:Response)=> response.json());
    }

    updateProviders(req:any){
        return this._http.post(this._deleteurl,req ,this.options)
        .map((response:Response)=> response.json());
    }
}