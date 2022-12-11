import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgxMaskModule } from 'ngx-mask';

// Components
import { HomeComponent } from './components/home/home.component';
import { ApplicationFolderComponent } from './components/application/application-folder/application-folder.component';
import { ApplicationFormComponent } from './components/application/application-form/application-form.component';
import { TextareaRestrictComponent } from './components/application/application-form/textarea-restrict/textarea-restrict.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { SigninComponent } from './components/authentication/signin/signin.component';
import { UpdateApplicantComponent } from './components/authentication/update-applicant/update-applicant.component';
import { MyScholarshipsComponent } from './components/authentication/my-scholarships/my-scholarships.component';
import { ChangePasswordComponent } from './components/authentication/password/password.component';
import { ForgotPasswordComponent } from './components/authentication/forgot-password/forgot-password.component';
import { ApplicantResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ScholarshipComponent } from './components/scholarship/scholarship.component';
import { ApplicationComponent } from './components/application/application.component';
import { ScholarshipHeadingComponent } from './components/heading/heading.component';
import { HelpComponent } from './components/help/help.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AppComponent } from './app.component';
import { ApplicationReviewComponent } from './components/application/review/review.component';
import { ReviewComponent } from './components/scholarship/review/review.component';
import { AutoFormComponent } from './shared/components/auto-form/auto-form.component';
import { ConfirmComponent } from './shared/components/confirm/confirm.component';
import { MiniProfileComponent } from './shared/components/mini-profile/mini-profile.component';
import { UploadProgressComponent } from './shared/components/upload-progress/upload-progress.component';

// Services
import { ScholarshipService } from './app.service';
import { ConfirmService } from './shared/components/confirm/confirm.service';
import { ConstantsService } from './shared/services/constants.service';
import { FormsService } from './components/application/application-form/forms.service';

// Pipes
import { EncodeUriPipe } from './pipes/encodeURI.pipe';
import { KeysPipe } from './pipes/keys.pipe';
import { SSNPipe } from './pipes/ssn.pipe';

// Directives
import { ViewRefDirective } from './shared/directives/view-ref.directive';

// Interceptors
import { TokenInterceptor } from './interceptors/token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ApplicationFolderComponent,
    ApplicationFormComponent,
    TextareaRestrictComponent,
    AuthenticationComponent,
    LoginComponent,
    SigninComponent,
    UpdateApplicantComponent,
    MyScholarshipsComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    ApplicantResetPasswordComponent,
    ScholarshipComponent,
    ReviewComponent,
    ApplicationComponent,
    ScholarshipHeadingComponent,
    ApplicationReviewComponent,
    SpinnerComponent,
    AutoFormComponent,
    ConfirmComponent,
    UploadProgressComponent,
    EncodeUriPipe,
    SSNPipe,
    KeysPipe,
    HelpComponent,
    MiniProfileComponent,
    ViewRefDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    AppRoutingModule,
    NgxMaskModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    })
  ],
  exports: [ViewRefDirective],
  providers: [
    ScholarshipService,
    FormsService,
    ConstantsService,
    ConfirmService,
    NgbActiveModal,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
