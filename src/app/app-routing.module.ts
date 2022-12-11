import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { HelpComponent } from './components/help/help.component';
import { ScholarshipComponent } from './components/scholarship/scholarship.component';
import { ApplicationComponent } from './components/application/application.component';
import { ApplicantResetPasswordComponent } from './components/reset-password/reset-password.component';

import { HomeResolver } from './components/home/home.resolver';
import { ScholarshipResolver } from './components/scholarship/scholarship.resolver';
import { ApplicationResolver } from './components/application/application.resolver';
import { ResetPasswordResolver } from './components/reset-password/reset-password.resolver';

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
    component: AuthenticationComponent,
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
  providers: [HomeResolver, ScholarshipResolver, ApplicationResolver, ResetPasswordResolver]
})
export class AppRoutingModule {}
