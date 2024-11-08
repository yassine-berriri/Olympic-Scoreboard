import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CountryDetailsComponent} from './pages/country-details/country-details.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { BaseChartDirective  } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, CountryDetailsComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, BaseChartDirective, NgxChartsModule, BrowserAnimationsModule],
  providers: [
    provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
