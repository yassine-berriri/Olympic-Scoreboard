import { Component, HostListener, OnInit } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<any> = of(null);
  public chartData: { id: number; name: string; value: number }[] = [];
  public numberOfJo: number = 0;
  public chartView: [number, number] = [0,0]; 

  constructor(private olympicService: OlympicService, private router: Router
    
  ) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics().pipe(
      map((data) => {
        this.numberOfJo = this.olympicService.countUniqueGames(data);
        return this.processDataForChart(data);
      })
    );

    this.setChartSize(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.setChartSize(event.target.innerWidth);
  }

  processDataForChart(data: OlympicCountry[]): { id: number; name: string; value: number }[] {
    if (!data) {
      this.chartData = [];
      return this.chartData;
    }

    this.chartData = data.map((country: OlympicCountry) => {
      const totalMedals = country.participations.reduce(
        (sum: number, participation: Participation) => sum + participation.medalsCount,
        0
      );

      console.log("country.id :   ", country.id);

      return {id: country.id, name: country.country, value: totalMedals };
    });
    return this.chartData;
  }

  onSelect(event: any): void {
    const selectedCountry = this.chartData.find((country) => country.name === event.name);
    const countryId = selectedCountry ? selectedCountry.id : null;
  
    console.log('Item clicked', {
      id: countryId,
      name: event.name,
      value: event.value,
      label: event.label,
    });

    if (countryId !== null) {
    this.router.navigate(['/country-details', countryId]);
    }
  }

  private setChartSize(width: number): void {
    if (width < 576) { // Extra small devices
      this.chartView = [300, 250];
    } else if (width < 768) { // Small devices
      this.chartView = [450, 350];
    } else if (width < 992) { // Medium devices
      this.chartView = [600, 400];
    } else { // Large devices and up
      this.chartView = [500, 600];
    }
  }

  public customTooltipText(data: any): string {
   
    return `<strong>${data.data.name}</strong><br><span>&#x1F396;</span> ${data.value}`;
  }
}
