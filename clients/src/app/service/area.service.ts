// data.service.ts
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';


const USER_API = 'http://localhost:32355/web4/calc/getalldata';
const USER_API_DELETE = 'http://localhost:32355/web4/calc/delete';

const USER_API_CALC = 'http://localhost:32355/web4/calc/calc';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  constructor(private http: HttpClient) {}

  getAllAreaData(): Observable<any[]> {
    return this.http.get<any[]>(USER_API);
  }

  deleteOn(): Observable<any>{
    return this.http.delete(USER_API_DELETE);
  }

  calculate(x: number, y: number, r: number): Observable<any> {
    const params = new HttpParams()
      .set('x', x.toString())
      .set('y', y.toString())
      .set('r', r.toString());

    return this.http.get(USER_API_CALC, { params });
  }
}
