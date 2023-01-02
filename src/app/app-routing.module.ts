import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ApplicantComponent } from './components/applicant/applicant.component';
import { HelpComponent } from './components/help/help.component';
import { ScholarshipComponent } from './components/scholarship/scholarship.component';
import { ApplicationComponent } from './components/application/application.component';
import { ApplicantResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ThirdPartyUploadComponent } from './components/application/third-party-upload/third-party-upload.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { HomeResolver } from './components/home/home.resolver';
import { ScholarshipResolver } from './components/scholarship/scholarship.resolver';
import { ApplicationResolver } from './components/application/application.resolver';
import { ResetPasswordResolver } from './components/reset-password/reset-password.resolver';
import { ThirdPartyRequestResolver } from './components/application/third-party-upload/third-party-upload.resolver';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    runGuardsAndResolvers: 'always',
    resolve: {
      data: HomeResolver
    }
  },
  {
    path: 'account',
    component: ApplicantComponent,
    runGuardsAndResolvers: 'always',
    resolve: {
      data: HomeResolver
    }
  },
  {
    path: 'help',
    component: HelpComponent,
    runGuardsAndResolvers: 'always',
    resolve: {
      data: HomeResolver
    }
  },
  { path: '404', component: NotFoundComponent },
  {
    path: ':scholarshipURL',
    component: ScholarshipComponent,
    runGuardsAndResolvers: 'always',
    resolve: {
      data: ScholarshipResolver
    }
  },
  {
    path: ':scholarshipURL/application',
    component: ApplicationComponent,
    runGuardsAndResolvers: 'always',
    resolve: {
      data: ApplicationResolver
    }
  },
  {
    path: 'password/reset/:authKey',
    component: ApplicantResetPasswordComponent,
    resolve: {
      data: ResetPasswordResolver
    }
  },
  {
    path: ':scholarshipURL/applications/:applicationID/:requestID',
    component: ThirdPartyUploadComponent,
    resolve: {
      data: ThirdPartyRequestResolver
    }
  },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
  providers: [
    HomeResolver,
    ScholarshipResolver,
    ApplicationResolver,
    ResetPasswordResolver,
    ThirdPartyRequestResolver
  ]
})
export class AppRoutingModule {}
