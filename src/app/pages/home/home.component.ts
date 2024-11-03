import { Component, OnInit } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<any> = of(null);
  public chartData: { name: string; value: number }[] = [];

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics().pipe(
      map((data) => this.processDataForChart(data))
    );
  }

  processDataForChart(data: OlympicCountry[]): { name: string; value: number }[] {
    if (!data){
      return [];
    }


    this.chartData = data.map((country: OlympicCountry) => {
      const totalMedals = country.participations.reduce((sum: number, participation: Participation) => 
        sum + participation.medalsCount, 0);
      return { name: country.country, value: totalMedals };
    });
    return this.chartData;
  }

  // Define the onSelect method to handle chart selection events
  onSelect(event: any): void {
    console.log('Item clicked', event);
  }

  
}
