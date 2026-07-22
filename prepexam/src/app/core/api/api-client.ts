import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedRequest, PaginatedResponse } from './dto/pagination.dto';

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private http = inject(HttpClient);

  get<T>(url: string, params?: Record<string, string>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        httpParams = httpParams.set(key, value);
      });
    }
    return this.http.get<T>(url, { params: httpParams });
  }

  post<T>(url: string, body: unknown): Observable<T> {
    return this.http.post<T>(url, body);
  }

  put<T>(url: string, body: unknown): Observable<T> {
    return this.http.put<T>(url, body);
  }

  patch<T>(url: string, body: unknown): Observable<T> {
    return this.http.patch<T>(url, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }

  getPaged<T>(url: string, request: PaginatedRequest): Observable<PaginatedResponse<T>> {
    let httpParams = new HttpParams()
      .set('page', request.page.toString())
      .set('size', request.size.toString());

    if (request.sortBy) httpParams = httpParams.set('sortBy', request.sortBy);
    if (request.sortDir) httpParams = httpParams.set('sortDir', request.sortDir);
    if (request.search) httpParams = httpParams.set('search', request.search);

    return this.http.get<PaginatedResponse<T>>(url, { params: httpParams });
  }
}
