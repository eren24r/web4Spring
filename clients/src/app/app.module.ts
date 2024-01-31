import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from "./material-module";
import {LoginComponent} from "./auth/login/login.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {authInterceptorProviders} from "./helper/auth-interceptor.service";
import {authErrorInterceptorProviders} from "./helper/error-interceptor.service";
import {RegisterComponent} from "./auth/register/register.component";
import {IndexComponent} from "./layout/index/index.component";
import {MatCellDef, MatHeaderCellDef, MatHeaderRowDef, MatRowDef, MatTable} from "@angular/material/table";
import {AreaService} from "./service/area.service";
import {DatePipe} from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    IndexComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    MatTable,
    MatHeaderRowDef,
    MatHeaderCellDef,
    MatCellDef,
    MatRowDef
  ],
  providers: [
    provideClientHydration(),
    authInterceptorProviders,
    authErrorInterceptorProviders,
    AreaService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
