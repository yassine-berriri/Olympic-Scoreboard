import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<any>(undefined);
  private numberOfJo: number = 0;

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<any>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getOlympicById(id: number): Observable<OlympicCountry | undefined> {
    return this.olympics$.pipe(
      filter((data) => data !== undefined), // Wait until olympics$ has loaded data
      switchMap((olympics: OlympicCountry[]) => {
        const foundCountry = olympics.find((olympic) => olympic.id === id);
        return of(foundCountry);
      })
    );
  }
  


  countUniqueGames(data: any[]): number {
    if (!data) return 0;

    const uniqueYears = new Set<number>();
    data.forEach(country => {
      country.participations.forEach((participation: { year: number }) => {
        uniqueYears.add(participation.year);
      });
    });

    return uniqueYears.size;
  }


}
