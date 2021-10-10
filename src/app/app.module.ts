import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireModule } from '@angular/fire';


import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { AuthService } from './auth/auth.service';
import { environment } from '../environments/environment';
import { UiService } from './shared/ui.service';
import { AuthModule } from './auth/auth.module';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { StoreModule } from '@ngrx/store';
import { reducers } from './app.reducer';
import { PropertyManagerService } from './property-manager/property-manager.service';
import { PropertyService } from './property/property.service';
import { TennantService } from './tennant/tennant.service';
import { PropertyGroupService } from './property-group/property-group.service';
import { CostService } from './analytics/cost/cost.service';


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFirestoreModule,
    StoreModule.forRoot(reducers),
    AuthModule
  ],
  providers: [
    AuthService, 
    UiService, 
    PropertyManagerService, 
    PropertyService,
    PropertyGroupService,
    CostService,
    TennantService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
