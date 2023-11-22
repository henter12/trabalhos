import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PessoaServiceService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public getAllPessoa(params: HttpParams): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/pessoa/`, { params });
  }
  
  public getIdPessoa(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/pessoa/${id}`);
  };
  
  public postPessoa(payload: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiUrl}/pessoa`, payload);
  };

  public updatePessoa(id: number,data: any ): Observable<any> {
    return this.httpClient.put<any>(`${environment.apiUrl}/pessoa/${id}`, data);
  };

  public deletePessoa(id: number): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/pessoa/${id}`);
  };

}

