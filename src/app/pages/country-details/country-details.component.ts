import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrl: './country-details.component.scss'
})
export class CountryDetailsComponent implements OnInit {

  countryId: number | null = null;
  public olympicCountry: OlympicCountry | undefined;
  numberOfEntries: number = 0;
  totalMedals: number = 0;
  totalAthletes: number = 0;
  chartData: { name: string; series: { name: string; value: number }[] }[] = [];
  public chartView: [number, number] = [600, 500]; 

  constructor(private route: ActivatedRoute, private olympicService: OlympicService, private router: Router) {}


  ngOnInit(): void {
    this.countryId = +this.route.snapshot.paramMap.get('id')!;
    console.log('Country ID:', this.countryId);


    this.olympicService.getOlympicById(this.countryId).subscribe(
      (country) => {
        if (country) {
          console.log('Country:', country);
          this.olympicCountry = country;
          this.calculateStatistics();
          this.prepareChartData();
        } else {
          console.error('Country not found');
          this.router.navigate(['error']);

        }
      },
      (error) => {
        console.error('Error fetching country:', error);
        this.router.navigate(['error']);
      }
    );

    this.setChartSize(window.innerWidth);

  }

  
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.setChartSize(event.target.innerWidth);
  }

  calculateStatistics(): void {
    if (!this.olympicCountry) return;

    this.numberOfEntries = this.olympicCountry.participations.length;
    this.totalMedals = this.olympicCountry.participations.reduce(
      (sum, participation) => sum + participation.medalsCount,
      0
    );
    this.totalAthletes = this.olympicCountry.participations.reduce(
      (sum, participation) => sum + participation.athleteCount,
      0
    );
  }

  prepareChartData(): void {
    if (!this.olympicCountry) return;

    this.chartData = [
      {
        name: this.olympicCountry.country,
        series: this.olympicCountry.participations.map((participation: Participation) => ({
          name: participation.year.toString(),
          value: participation.medalsCount
        }))
      }
    ];
  }

  goBack(): void {
    this.router.navigate(['/']);
  }


  
  private setChartSize(width: number): void {
    if (width < 576) { // Extra small devices
      this.chartView = [300, 250];
    } else if (width < 768) { // Small devices
      this.chartView = [450, 350];
    } else if (width < 992) { // Medium devices
      this.chartView = [600, 400];
    } else { // Large devices and up
      this.chartView = [500, 280];
    }
  }

}
